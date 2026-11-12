import Feature from 'ol/Feature'
export namespace IWfs {
    export type WfsVersion = "1.0.0" | "1.1.0" | "2.0.0"
    export namespace Transaction {
        export interface featureOption {
            type: "Point" | "LineString" | "MultiPolygon" | "Polygon",
            coordinates: Array<number | number[] | Array<number[]>>,
            properties?: Record<string, string | number | undefined>,
            id?: string | number
        }

        export interface FeatureTransactionOption {
            /**
             * 操作类型
             */
            type: "modif" | "create" | "delete",
            /**
             * 工作区的名称
             */
            featurePrefix: string,
            /**
             * 工作区的命名空间URI
             */
            featureNS: string, // 注意这个值必须为创建工作区时的命名空间URI
            /**
             * 图层名
             */
            featureType: string,
            /**
             * 坐标系
             */
            srsName?: string,
            /**
             * 要操作的要素
             */
            features: Feature[] | featureOption[]
        }
    }

    /**
     * GetFeature 请求参数。各版本返回的都是 GeoJSON，参数名固定为 typename、maxFeatures。
     */
    export interface GetFeatureParameters {
        service: "WFS";
        version?: WfsVersion;
        request: "GetFeature";
        /**
         * 图层名
         */
        typename: string;
        /**
         * 要素ID
         */
        featureId?: string;
        /**
         * 返回结果的投影，如果和原坐标系不一样，则会转换后返回
         */
        srsName?: string;
        /**
         * 空间查询的四至
         */
        bbox?: string;
        /**
         * CQL查询条件
         */
        CQL_FILTER?: string;
        /**
         * 结果返回的字段，多个的话以逗号分隔
         */
        propertyName?: string;
        /**
         * 从哪条数据开始查。0 是有效值。
         */
        startIndex?: number | string;
        /**
         * 排序字段(倒序的话字段名需要后面加"+D")
         */
        sortBy?: string;
        /**
         * 最多返回的数据条数。0 是有效值。
         */
        maxFeatures?: number | string;
        outputFormat?: "application/json";
        [key: string]: string | number | undefined;
    }

    /**
     * wfs服务支持的类型
     */
    export type WfsFormats = 'application/json' | 'shape-zip' | 'csv' | 'GML2' | 'GML3' | 'JSONP'
}