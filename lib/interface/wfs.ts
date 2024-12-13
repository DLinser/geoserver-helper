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
     * GetFeature通用参数
     */
    interface GetFeatureCommonParameters{
        service: "WFS";
        version: "1.0.0" | "1.1.0";
        request: "GetFeature";

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
        bbox?:string;

        /**
         * CQL查询条件
         */
        CQL_FILTER?: string;

        /**
         * 结果返回的字段，多个的话以逗号分隔
         */
        propertyName?: string;
        /**
         * 从哪条数据开始查
         */
        startIndex?: number | string;
        /**
         * 排序字段(倒序的话字段名需要后面加"+D")
         */
        sortBy?: string;
        outputFormat: "application/json";
        /**
         * 这里允许任意类型的额外属性
         */
        [key: string]: string | number | undefined;
    }
    /**
     * 1.x版本的GetFeature参数(包括1.0.0和1.1.0)
     */
    export interface GetFeatureParametersOfVersionOne extends GetFeatureCommonParameters{
        /**
         * 图层名
         */
        typename: string;
        /**
         * 最多返回的数据条数
         */
        maxFeatures?: number | string;
    }
    /**
     * 2.x版本的参数(包括2.0.0)
     */
    export interface GetFeatureParametersOfVersionTwo extends GetFeatureCommonParameters{
        /**
         * 图层名
         */
        typeNames: string;
        /**
         * 最多返回的数据条数
         */
        count: number | string;
    }
    export type GetFeatureParameters = GetFeatureParametersOfVersionOne | GetFeatureParametersOfVersionTwo
}