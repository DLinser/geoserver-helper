import { IWorkspace } from "./workspace";

export namespace IDatastore {
  /**
   * 矢量数据源类型
   */
  export enum VectorDatastoreType {
    PostGIS = "PostGIS",
    Mysql = "Mysql",
    GeoPackage = "GeoPackage",
    Shapefile = "Shapefile",
    Shapefiles = "Directory of spatial files (shapefiles)",
  }
  /**
   * 栅格数据源类型
   */
  export enum CoverageDatastoreType {
    GeoTIFF = "GeoTIFF",
    ImageMosaic = "ImageMosaic",
    MBTiles = "MBTiles",
    ArcGrid = "ArcGrid",
    WorldImage = "WorldImage",
  }
  /**
   * 数据源类型
   */
  export type DatastoreType = VectorDatastoreType | CoverageDatastoreType;

  //新增或者编辑表单
  export interface DatastoreOperationForm {
    /**
     * 临时参数
     */
    workspace?: string;
    /**
     * 数据存储类型
     */
    type?: DatastoreType;
    /**
     * 名称
     */
    name: string;
    /**
     * 是否启用(默认是true)
     */
    enabled?: boolean;
    /**
     * 描述
     */
    description?: string;
    /**
     * 文件地址(一般用于栅格数据源)
     */
    url?: string;
    // 数据库链接参数
    connectionParameters?: DatastoreConnectionParameters;
  }

  // /**
  //  * shp类型的数据存储表单
  //  */
  // export interface ShapDataStoreForm {
  //     name: string
  //     connectionParameters: DatastoreConnectionParameters
  // }
  // /**
  //  * PostGIS类型的数据存储表单
  //  */
  // export interface PostGISDataStoreForm {
  //     name: string
  //     connectionParameters: DatastoreConnectionParameters
  // }

  // 数据库链接参数单参数对象
  export interface ConnectionRecord {
    /**
     * 键
     */
    "@key": string;
    /**
     * 值
     */
    $: string;
    label?: string;
    required?: boolean;
    needShow?: boolean;
    type?: string;
  }
  // 数据库链接参数
  export interface DatastoreConnectionParameters {
    entry: ConnectionRecord[];
  }
  /**
   * 矢量数据存储详情
   */
  export interface DatastoreInfo {
    /**
     * 名称
     */
    name: string;
    /**
     * 类型
     */
    type: string;
    /**
     * 是否启用
     */
    enabled: boolean;
    /**
     * 所属工作空间
     */
    workspace: IWorkspace.WorkspaceOverview;
    /**
     * 数据库链接参数
     */
    connectionParameters?: DatastoreConnectionParameters;
    _default: boolean;
    disableOnConnFailure: boolean;
    /**
     * 创建时间
     */
    dateCreated: string;
    /**
     * 修改时间
     */
    dateModified: string;
    /**
     * 服务信息
     */
    featureTypes: string;
  }
  /**
   * 栅格数据存储详情
   */
  export interface CoveragestoreInfo {
    /**
     * 名称
     */
    name: string;
    /**
     * 类型
     */
    type: string;
    /**
     * 是否启用
     */
    enabled: boolean;
    /**
     * 所属工作空间
     */
    workspace: IWorkspace.WorkspaceOverview;
    _default: boolean;
    disableOnConnFailure: boolean;
    /**
     * 创建时间
     */
    dateCreated: string;
    /**
     * 修改时间
     */
    dateModified: string;
    /**
     * 栅格文件的路径
     */
    url: string;
    /**
     * 栅格信息
     */
    coverages: string;
  }

  /**
   * 返回的矢量数据存储详情结果
   */
  export interface ResDatastoreInfo {
    dataStore: DatastoreInfo;
  }
  /**
   * 返回的栅格数据存储详情结果
   */
  export interface ResCoveragestoreInfo {
    coverageStore: CoveragestoreInfo;
  }

  /**
   * 数据存储概览
   */
  export interface DatastoreOverview {
    /**
     * 名称
     */
    name: string;
    /**
     * 详情地址
     */
    href: string;
  }

  /**
   * 查询的矢量数据存储列表
   */
  export type ResDatastoreList = {
    /**
     * 矢量数据存储
     */
    dataStores: {
      dataStore: DatastoreOverview[] | string;
    };
  };
  /**
   * 查询的栅格数据存储列表
   */
  export type ResCoveragestoreList = {
    /**
     * 栅格数据存储
     */
    coverageStores: {
      coverageStore: DatastoreOverview[] | string;
    };
  };
}
