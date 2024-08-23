import { WFS } from 'ol/format';
import { WriteGetFeatureOptions } from 'ol/format/WFS';
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Polygon from 'ol/geom/Polygon'
import MultiPolygon from 'ol/geom/MultiPolygon';
import LineString from 'ol/geom/LineString'
import CQLParser from 'geostyler-cql-parser'
import { Filter as GeoFilter, Operator as GeoOperator, Expression as GeoExpression, PropertyType as GeoPropertyType } from 'geostyler-style';
const cqlParser = new CQLParser()
import {
  and as andFilter,
  or as orFilter,
  equalTo as equalToFilter,
  notEqualTo as notEqualToFilter,
  like as likeFilter,
} from 'ol/format/filter';
import Filter from 'ol/format/filter/Filter';
const WFSTSerializer = new WFS()

/**
 * @description: cql字符串转ol的Filter
 * @param {GeoFilter} cqlCondition
 * @return {*}
 */
const geoStyleCqlToOlFilter = (cqlCondition: GeoFilter | GeoExpression<GeoPropertyType>) => {
  // TODO 因为cqlCondition还有自定义的类型 所以这个地方可能会有特殊情况
  let cqlOperator: GeoOperator | "like" = "=="
  let cqlProperty: GeoFilter | GeoExpression<GeoPropertyType> = ""
  let cqlValue: GeoFilter | GeoExpression<GeoPropertyType> = ""
  if (cqlCondition instanceof Array && cqlCondition.length > 0) {
    cqlOperator = cqlCondition[0]
    cqlProperty = cqlCondition[1] as string
    cqlValue = cqlCondition[2] as string
  } else if (cqlCondition && typeof cqlCondition == 'object') {
    const likeCqlCondition = cqlCondition as {
      escape: boolean
      hasNot: boolean
      left: string
      right: string
      type: string
    }
    cqlOperator = likeCqlCondition.type as GeoOperator
    cqlProperty = likeCqlCondition.left
    cqlValue = likeCqlCondition.right
  }

  let filter: Filter;
  switch (cqlOperator) {
    case '&&':
      filter = andFilter(
        geoStyleCqlToOlFilter(cqlProperty),
        geoStyleCqlToOlFilter(cqlValue),
      )
      break;
    case '||':
      filter = orFilter(
        geoStyleCqlToOlFilter(cqlProperty),
        geoStyleCqlToOlFilter(cqlValue),
      )
      break;
    //export type ComparisonOperator = '==' | '*=' | '!=' | '<' | '<=' | '>' | '>=' | '<=x<=';
    case '==':
      filter = equalToFilter(cqlProperty as string, cqlValue as string | number);
      break;
    case '!=':
      filter = notEqualToFilter(cqlProperty as string, cqlValue as string | number);
      break;
    case 'like':
      filter = likeFilter(cqlProperty as string, cqlValue as string);
      break;
    // 添加更多的操作符和过滤器类型
    default:
      filter = equalToFilter(cqlProperty as string, cqlValue as string | number);
  }
  return filter
}
export const creatFeatureRequestXml = (option: {
  srsName: string,
  featureNS: string,
  featurePrefix: string,
  featureTypes: string[],
  outputFormat: string,
  propertyNames?: string[],
  startIndex?: number | undefined;
  count?: number | undefined;
  cql?: string
}) => {
  const writeGetFeatureOptions: WriteGetFeatureOptions = {
    srsName: option.srsName,
    //工作区命名空间URI
    featureNS: option.featureNS,
    //工作区的名称
    featurePrefix: option.featurePrefix,
    //图层名称列表
    featureTypes: option.featureTypes || [],
    propertyNames: option.propertyNames,
    startIndex: option.startIndex,
    count: option.count,
    outputFormat: option.outputFormat,
  }
  if (option.cql) {
    const geoStyleCql = cqlParser.read(option.cql)
    const cqlFilter = geoStyleCqlToOlFilter(geoStyleCql as any[])
    writeGetFeatureOptions.filter = cqlFilter
  }
  const featureRequest = WFSTSerializer.writeGetFeature(writeGetFeatureOptions);
  return new XMLSerializer().serializeToString(featureRequest)
}
export type featureOption = {
  type: "Point" | "LineString" | "MultiPolygon" | "Polygon",
  coordinates: Array<number | number[] | Array<number[]>>,
  properties?: Record<string, string | number | undefined>,
  id?: string | number
}

/**
 * @description: 格式化要素（统一为openlayers的格式）
 * @param {Feature[] | featureOption[]} features 要素列表
 * @return {Feature[]} 格式化后的要素列表
 */
export const formateFeatures = (features: Feature[] | featureOption[]) => {
  const readyToReturnFeatures: Feature[] = []
  features.forEach(singleFeature => {
    if (singleFeature instanceof Feature) {
      readyToReturnFeatures.push(singleFeature)
    } else {
      if (singleFeature.type && singleFeature.coordinates) {
        let initedFeature;
        if (singleFeature.type == "Point") {
          initedFeature = new Feature({
            geometry: new Point(singleFeature.coordinates as number[]),
          })
        } else if (singleFeature.type == "LineString") {
          initedFeature = new Feature({
            geometry: new LineString(singleFeature.coordinates as Array<number[]>),
          })
        } else if (singleFeature.type == "MultiPolygon") {
          initedFeature = new Feature({
            geometry: new MultiPolygon(singleFeature.coordinates as number[]),
          })
        } else { //(singleFeature.type == "Polygon") 
          initedFeature = new Feature({
            geometry: new Polygon(singleFeature.coordinates as number[]),
          })
        }
        if (singleFeature.properties) {
          initedFeature?.setProperties(singleFeature.properties)
        }
        if (singleFeature.id) {
          initedFeature?.setId(singleFeature.id)
        }
        readyToReturnFeatures.push(initedFeature)
      }
    }
  })
  return readyToReturnFeatures
}

interface IFeatureTransactionOption {
  type: "modif" | "create" | "delete",
  featureNS: string, // 注意这个值必须为创建工作区时的命名空间URI
  featureType: string,
  srsName: string,
  features: Feature[] | featureOption[]
}
/**
 * @description: 创建要素变换(增删改)xml
 * @param {IFeatureTransactionOption} option 配置
 * @return {string}
 */
export const creatFeatureTransactionXml = (option: IFeatureTransactionOption) => {
  let featObject: Node;
  const formatedFeatures = formateFeatures(option.features)
  if (option.type == "modif") {
    featObject = WFSTSerializer.writeTransaction(null as any, formatedFeatures, null as any, {
      featureType: option.featureType,
      featureNS: option.featureNS, // 注意这个值必须为创建工作区时的命名空间URI
      srsName: option.srsName,
      featurePrefix: '', //工作空间
      nativeElements: []
    });
  } else if (option.type == "create") {
    featObject = WFSTSerializer.writeTransaction(formatedFeatures, null as any, null as any, {
      featureType: option.featureType,
      featureNS: option.featureNS, // 注意这个值必须为创建工作区时的命名空间URI
      srsName: option.srsName,
      featurePrefix: '',
      nativeElements: []
    });
  } else if (option.type == "delete") {
    featObject = WFSTSerializer.writeTransaction(null as any, null as any, formatedFeatures, {
      featureType: option.featureType,
      featureNS: option.featureNS, // 注意这个值必须为创建工作区时的命名空间URI
      srsName: option.srsName,
      featurePrefix: '',
      nativeElements: []
    });
  } else {
    return new Error('type：created/modified/deleted');
  }
  return new XMLSerializer().serializeToString(featObject)
}