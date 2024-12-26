export namespace ISystem {
    /**
     * 系统信息项
     */
    export interface StatusItem{
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
    }
    /**
     * 系统状态
     */
    export interface Status {
        metrics: {
            metric: StatusItem[]
        }
    }
    /**
     * 版本信息项
     */
    export interface VersionItem{
        "@name": string,
        "Build-Timestamp": string,
        "Version": string,
        "Git-Revision": string
    }
    /**
     * 版本信息（包括Geoserver、Geotools、GeoWebCache）
     */
    export interface Version {
        about: {
            resource: VersionItem[]
        }
    }
    /**
     * server支持的字体
     */
    export interface Fonts {
        fonts: string[]
    }

    /**
     * 日志配置
     */
    export interface LogConfiguration {
        logging: {
            id?: string
            level: "DEFAULT_LOGGING" | "GEOSERVER_DEVELOPER_LOGGING" | "GEOTOOLS_DEVELOPER_LOGGING" | "PRODUCTION_LOGGING" | "QUIET_LOGGING" | "TEST_LOGGING" | "VERBOSE_LOGGING"
            location: string;
            stdOutLogging: boolean;
        };
    }
}