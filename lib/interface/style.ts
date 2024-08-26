// * 图层模块
export namespace IStyle {
    interface StyleCommonInfo {
        code?: string
        createBy?: string
        createTime?: string
        dateCreated?: string
        dateModified?: string
        format?: string
        id?: string
        ids?: string[]
        name?: string
        params?: {}
        remark?: string
        searchValue?: string
        sldFileText?: string
        styleFilePath?: string
        type?: string
        updateBy?: string
        updateTime?: string
        workspaceId?: string
        workspaceName?: string
    }
    // 样式查询表单
    export interface StyleQueryForm extends StyleCommonInfo {
        pageNum: number
        pageSize: number
    }
    // 样式新增或编辑表单
    export interface StyleAddOrUpdateForm extends StyleCommonInfo {
        name: string
    }
    // 接口返回的样式信息
    export interface ResStyleInfo {
        code: string
        createBy: string
        createTime: string
        dateCreated: string
        dateModified: string
        format: string
        id: string
        ids?: string[]
        name: string
        params: {}
        remark: string
        searchValue: string
        sldFileText: string
        styleFilePath: string
        type: string
        updateBy: string
        updateTime: string
        workspaceId: string
        workspaceName: string
    }
    //查询的样式列表结果
    export type ResStyleList = ResStyleInfo[]

    //样式详细
    export interface ResStyleDetailInfo {
        style: {
            name: string
            format: string
            languageVersion: {
                version: string
            }
            filename: string
            dateCreated: string
            dateModified: string
            workspace?: {
                name: string
            }
        }
    }
    //要展示的样式详细
    export interface ResStyleDetailInfoShow {
        name: string
        version: string
        dateCreated: string
        workspace: string
    }
}
