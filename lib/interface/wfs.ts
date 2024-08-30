import Feature from 'ol/Feature'
export namespace IWfs {
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

}