import { WFS } from 'ol/format';
import { WriteGetFeatureOptions } from 'ol/format/WFS';
import WKT from 'ol/format/WKT';
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
  intersects as intersectsFilter,
  within as withinFilter,
  contains as containsFilter,
  disjoint as disjointFilter,
} from 'ol/format/filter';
import Filter from 'ol/format/filter/Filter';
import { IWfs } from '../interface/wfs';
const WFSTSerializer = new WFS()


/**
 * 空间查询Filter的数组
 */
let geometryFilterArray: Filter[] = []


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
      if ((cqlProperty as string).includes("spatialMatch")) {
        filter = geometryFilterArray[Number((cqlProperty as string).substring(12))]
      } else {
        filter = equalToFilter(cqlProperty as string, cqlValue as string | number);
      }
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
/**
 * 创建要素查询的xml（暂不支持TOUCHES|CROSSES|OVERLAPS|DWITHIN|BEYOND）
 * @param option 
 * @returns 
 */
export const creatFeatureRequestXml = (option: {
  srsName: string,
  featureNS: string,
  featurePrefix: string,
  featureTypes: string[],
  outputFormat: string,
  propertyNames?: string[],
  startIndex?: number | undefined;
  maxFeatures?: number | undefined;
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
    maxFeatures: option.maxFeatures,
    outputFormat: option.outputFormat,
  }
  if (option.cql) {
    //cql太长的话正则匹配会因崩溃而失效
    if (option.cql.length <= 680) {
      let nonSpatialCql = option.cql + ""
      geometryFilterArray = []
      const regex = /(INTERSECTS|WITHIN|CONTAINS|DISJOINT)\s*\(\s*([\w_]+)\s*,\s*((POINT|LINESTRING|MULTIPOLYGON|POLYGON)\((?:(?:[\d\s,.]+)|(?:\([\d\s,.]+\))|(?:\(\([\d\s,.]+\)\)))\))\)/g;
      let spatialMatch;
      while ((spatialMatch = regex.exec(option.cql)) !== null) {
        const wktGeometry = spatialMatch[3];
        const spatialField = spatialMatch[2];
        let geometry = new WKT().readGeometry(wktGeometry, {});
        if (spatialMatch[1].toUpperCase() === 'INTERSECTS') {
          geometryFilterArray.push(intersectsFilter(spatialField, geometry))
        } else if (spatialMatch[1].toUpperCase() === 'WITHIN') {
          geometryFilterArray.push(withinFilter(spatialField, geometry))
        } else if (spatialMatch[1].toUpperCase() === 'CONTAINS') {
          geometryFilterArray.push(containsFilter(spatialField, geometry))
        } else if (spatialMatch[1].toUpperCase() === 'DISJOINT') {
          geometryFilterArray.push(disjointFilter(spatialField, geometry))
        } else if (spatialMatch[1].toUpperCase() === 'TOUCHES') {
          geometryFilterArray.push(disjointFilter(spatialField, geometry))
        }
        nonSpatialCql = spatialMatch ? nonSpatialCql.replace(spatialMatch[0], `spatialMatch${geometryFilterArray.length - 1} = 0`) : option.cql;
      }
      const geoStyleCql = cqlParser.read(nonSpatialCql)
      const cqlFilter = geoStyleCqlToOlFilter(geoStyleCql as any[])
      writeGetFeatureOptions.filter = cqlFilter
    } else { //这种情况一般都是带有空间查询的
      if (option.cql.includes("AND") || option.cql.includes("OR")) { //复杂条件暂时不支持
        let nonSpatialCql = option.cql + ""
        const unitSimpleCqlArray = option.cql.replaceAll(" AND ", " splitTag ").replaceAll(" OR ", " splitTag ").split(" splitTag ")
        for (let i = 0; i < unitSimpleCqlArray.length; i++) {
          if (unitSimpleCqlArray[i].includes("INTERSECTS") || unitSimpleCqlArray[i].includes("WITHIN") || unitSimpleCqlArray[i].includes("CONTAINS") || unitSimpleCqlArray[i].includes("DISJOINT") || unitSimpleCqlArray[i].includes("TOUCHES")) {
            creatGeometryFilter(unitSimpleCqlArray[i])
            nonSpatialCql = nonSpatialCql.replace(unitSimpleCqlArray[i], `spatialMatch${geometryFilterArray.length - 1} = 0`);
          }
        }
        const geoStyleCql = cqlParser.read(nonSpatialCql)
        const cqlFilter = geoStyleCqlToOlFilter(geoStyleCql as any[])
        writeGetFeatureOptions.filter = cqlFilter
      } else {
        creatGeometryFilter(option.cql)
        writeGetFeatureOptions.filter = geometryFilterArray[0]
      }
    }
  }
  const featureRequest = WFSTSerializer.writeGetFeature(writeGetFeatureOptions);
  return new XMLSerializer().serializeToString(featureRequest)
}



export const creatGeometryFilter = (geometryFilterCql: string) => {
  const wktGeometry = geometryFilterCql.substring(geometryFilterCql.indexOf(", ") + 1, geometryFilterCql.length - 1);
  let spatialField = geometryFilterCql.substring(geometryFilterCql.indexOf("(") + 1, geometryFilterCql.indexOf(", ")).trim()
  let geometry = new WKT().readGeometry(wktGeometry, {});
  if (geometryFilterCql.includes("INTERSECTS")) {
    geometryFilterArray.push(intersectsFilter(spatialField, geometry))
  } else if (geometryFilterCql.includes("WITHIN")) {
    geometryFilterArray.push(withinFilter(spatialField, geometry))
  } else if (geometryFilterCql.includes("CONTAINS")) {
    geometryFilterArray.push(containsFilter(spatialField, geometry))
  } else if (geometryFilterCql.includes("DISJOINT")) {
    geometryFilterArray.push(disjointFilter(spatialField, geometry))
  } else if (geometryFilterCql.includes("TOUCHES")) {
    geometryFilterArray.push(disjointFilter(spatialField, geometry))
  }
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
    let initedFeature: Feature
    if (singleFeature instanceof Feature || (singleFeature as unknown as Feature).getProperties) {
      initedFeature = (singleFeature as Feature).clone()
      initedFeature?.setId((singleFeature as unknown as Feature).getId())
    } else {
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
    }
    if (initedFeature) {
      // 转换坐标
      var geometry = initedFeature.getGeometry()?.clone();
      geometry?.applyTransform(function (flatCoordinates, _flatCoordinates2, stride = 2) {
        for (var j = 0; j < flatCoordinates.length; j += stride) {
          var y = flatCoordinates[j];
          var x = flatCoordinates[j + 1];
          flatCoordinates[j] = x;
          flatCoordinates[j + 1] = y;
        }
        return flatCoordinates
      });
      initedFeature.setGeometry(geometry)
    }
    readyToReturnFeatures.push(initedFeature as Feature)
  })
  return readyToReturnFeatures
}

/**
 * @description: 创建要素变换(增删改)xml
 * @param {IWfs.Transaction.FeatureTransactionOption} option 配置
 * @return {string}
 */
export const creatFeatureTransactionXml = (option: IWfs.Transaction.FeatureTransactionOption) => {
  let featObject: Node;
  const formatedFeatures = formateFeatures(option.features)
  if (option.type == "modif") {
    featObject = WFSTSerializer.writeTransaction(null as any, formatedFeatures, null as any, {
      featureType: option.featureType,
      featureNS: option.featureNS, // 注意这个值必须为创建工作区时的命名空间URI
      srsName: option.srsName || "EPSG:4326",
      featurePrefix: option.featurePrefix || "", //工作空间
      nativeElements: []
    });
  } else if (option.type == "create") {
    featObject = WFSTSerializer.writeTransaction(formatedFeatures, null as any, null as any, {
      featureType: option.featureType,
      featureNS: option.featureNS, // 注意这个值必须为创建工作区时的命名空间URI
      srsName: option.srsName || "EPSG:4326",
      featurePrefix: option.featurePrefix || "",
      nativeElements: []
    });
  } else if (option.type == "delete") {
    featObject = WFSTSerializer.writeTransaction(null as any, null as any, formatedFeatures, {
      featureType: option.featureType,
      featureNS: option.featureNS, // 注意这个值必须为创建工作区时的命名空间URI
      srsName: option.srsName || "EPSG:4326",
      featurePrefix: option.featurePrefix || "",
      nativeElements: []
    });
  } else {
    featObject = WFSTSerializer.writeTransaction(null as any, formatedFeatures, null as any, {
      featureType: option.featureType,
      featureNS: option.featureNS, // 注意这个值必须为创建工作区时的命名空间URI
      srsName: option.srsName || "EPSG:4326",
      featurePrefix: option.featurePrefix || "", //工作空间
      nativeElements: []
    });
  }
  return new XMLSerializer().serializeToString(featObject)
}

/**
 * 格式化FeatureTransaction的结果
 * @param textResult 字符串类型的结果
 * @returns json类型的结果
 */
export const formatFeatureTransactionResult = (textResult: string) => {
  return WFSTSerializer.readTransactionResponse(textResult);
}