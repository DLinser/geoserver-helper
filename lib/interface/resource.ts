export namespace IResource {
    /**
     * 文件目录的子信息
     */
    export interface IChildrenItem {
        Name: string;
        link: string;
    }
    /**
     * 文件目录信息
     */
    export interface IDirectoryItem {
        Name?: string;
        parent?: string;
        children?: IChildrenItem[];
    }
}