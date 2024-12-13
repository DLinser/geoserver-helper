export namespace IResource {
    /**
     * 文件目录的子信息
     */
    export interface ILinkItem {
        href: string;
        rel: string;
        type: string;
    }

    /**
     * 文件资源详情 
     */    
    export interface IResourceInfo {
        name: string;
        parent: {
            path: string;
            link: ILinkItem;
        };
        lastModified: string;
        children: {
            child: {
                name: string;
                link: ILinkItem;
            }[];
        };
    }
    /**
     * 文件目录信息
     */
    export interface IDirectoryInfo {
        ResourceDirectory: IResourceInfo;
    }
}
