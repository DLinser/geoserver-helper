export namespace ISystem {
    /**
     * 系统状态
     */
    export interface Status {
        metrics: {
            metric: {
                /**
                 * 是否有效
                 */
                "available": boolean,
                /**
                 * 描述
                 */
                "description": string,
                /**
                 * 名称
                 */
                "name": string,
                /**
                 * 单位
                 */
                "unit": string,
                /**
                 * 分类
                 */
                "category": string,
                /**
                 * 标识符
                 */
                "identifier": string,
                /**
                 * 优先级
                 */
                "priority": number,
                /**
                 * 值
                 */
                "value": string
            }[]
        }
    }
    /**
     * 版本信息（包括Geoserver、Geotools、GeoWebCache）
     */
    export interface Version {
        about: {
            resource: {
                "@name": string,
                "Build-Timestamp": string,
                "Version": string,
                "Git-Revision": string
            }[]
        }
    }
    /**
     * server支持的字体
     */
    export interface Fonts {
        fonts: string[]
    }
}