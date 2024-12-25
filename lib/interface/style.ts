// * 图层模块
export namespace IStyle {
    /**
     * 样式列表中单个信息
     */
    export interface StyleInfoOfList {
        /**
         * 名称
         */
        name: string
        /**
         * 详情地址
         */
        href: string
    }
    /**
     * 样式列表结果
     */
    export interface StyleList {
        styles: {
            style: StyleInfoOfList[]
        }
    }

    /**
     * 单个样式详细
     */
    export interface StyleDetailInfo {
        name: string
        format: string
        languageVersion: {
            version: string
        }
        filename: string
        dateCreated: string
        dateModified: string
        /**
         * 工作空间
         */
        workspace?: {
            name: string
        }
    }
    /**
     * 返回的样式详细结果
     */
    export interface StyleDetailInfoRes {
        style: StyleDetailInfo
    }
}
