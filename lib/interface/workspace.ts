//工作空间模块
export namespace IWorkspace {
    //返回结果单项
    export interface WorkspaceOverview {
        name: string
        href: string
    }
    //查询的工作空间列表结果
    export interface WorkspaceList {
        workspaces: {
            workspace: WorkspaceOverview[]
        }
    }
    //工作空间详情
    export interface WorkspaceInfo {
        coverageStores: string
        dataStores: string
        dateCreated: string
        isolated: false
        name: string
        wmsStores: string
        wmtsStores: string
    }
    //查询的单个工作空间结果
    export interface ResWorkspaceInfo {
        workspace: {
            coverageStores: string
            dataStores: string
            dateCreated: string
            isolated: false
            name: string
            wmsStores: string
            wmtsStores: string
        }
    }
    //新增或者编辑表单
    export interface WorkspaceOperationForm {
        name: string
        default?: boolean
    }
}