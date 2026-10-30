# 接口类型（摘录）

以下类型摘自 `lib/interface/*`，命名空间通过 `geoserver-helper/interface` 或各模块源码引用。  
**非穷尽列表**；完整定义以源码为准。

## `ILayer`（`layer.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### interface `LayerSourceInfo`

```ts
export interface LayerSourceInfo {
    //名称
    name: string;
    // 类型
    "@class": string;
    //详情地址
    href: string;
  }
  //图层默认样式
  export interface LayerDefaultStyle {
    //名称
    name: string;
    // 工作空间
    workspace?: string;
    //详情地址
    href: string;
  }
  export interface LayerSourceAttributeInfo {
    name: string;
    minOccurs: number;
    maxOccurs: number;
    nillable: boolean;
    binding: string;
  }

  // 栅格图层的波段信息
  export interface ICoverageDimension {
    description: string;
    dimensionType: {
      name: string;
    };
    name: string;
    range: {
      min: string;
      max: string;
    };
    unit: string;
  }
  /**
   * 基础图层特征信息
   */
  export interface BaseFeatureTypeInfo {
    name: string;
    /**
     * 源数据名
     */
    nativeName: string;
    namespace?: {
      name: string;
      href: string;
    };
    title?: string;
    /**
     * 摘要
     */
  // ... 其余字段见 lib/interface/layer.ts
}
```

## `IStyle`（`style.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### interface `StyleInfoOfList`

```ts
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
```

## `IDatastore`（`datastore.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### enum `VectorDatastoreType`

```ts
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
  // ... 其余字段见 lib/interface/datastore.ts
}
```

## `ISecurity`（`security.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### interface `MasterPassword`

```ts
export interface MasterPassword {
    oldMasterPassword: string;
  }
  /**
   * 超级管理员密码修改表单
   */
  export interface MasterPasswordUpdateForm {
    oldMasterPassword: string;
    newMasterPassword: string;
  }
  /**
   * 角色
   */
  export interface Roles {
    roles: string[];
  }
  /**
   * 数据安全校验规则
   */
  export type SecurityRules = Record<string, string>;

  /**
   * 用户信息
   */
  export interface UserInfo{
    userName: string;
    password: string | null;
    enabled: boolean;
  }

  /**
   * 用户
   */
  export interface Users {
    users: UserInfo[];
  }

  /**
   * 用户新增或者编辑参数
   */
  export interface UserOperateParameters {
    user: UserInfo;
  }
}
```

## `ISystem`（`system.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### interface `StatusItem`

```ts
export interface StatusItem {
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
  // ... 其余字段见 lib/interface/system.ts
}
```

## `IWorkspace`（`workspace.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### interface `WorkspaceOverview`

```ts
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
        /**
         * 在新增的时候用到，编辑时用不到(Used during addition, not during editing)
         */
        default?: boolean
    }
}
```

## `INamespaces`（`namespaces.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### interface `NamespaceInfo`

```ts
export interface NamespaceInfo {
        prefix: string
        uri: string
        featureTypes: string
    }
    //返回命名空间结果
    export interface NamespaceInfoRes {
        namespace: NamespaceInfo
    }
}
```

## `IResource`（`resource.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### interface `ILinkItem`

```ts
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
```

## `IWfs`（`wfs.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### interface `featureOption`

```ts
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
  // ... 其余字段见 lib/interface/wfs.ts
}
```

## `IWms`（`wms.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### interface `GetCapabilitiesResponse`

```ts
export interface GetCapabilitiesResponse {
            Service: Service;
            Capability: {
                Request: {
                    GetCapabilities: Operation;
                    GetMap: Operation;
                    GetFeatureInfo: Operation;
                    DescribeLayer: Operation;
                    GetLegendGraphic: Operation;
                    GetStyles: Operation;
                };
                Exception: string[];
                Layer: {
                    Abstract: string
                    Layer: Layer[]
                    Title: string
                };
            };
            version: string
        }
    }
    export type GetFeatureInfoParameters = {
        version?: Extract<WmsVersion, "1.0.0" | "1.1.0" | "1.1.1">
        layers?: string
        styles?: string
        //坐标系
        srs?: string
        bbox?: string
        //返回地图图片的宽度（点选查询的时候用不到）
        width?: string
        //返回地图图片的高度（点选查询的时候用不到）
        height?: string
        //经度
        x?: string
        //纬度
        y?: string
        //返回结果有哪些字段，默认返回全部
        propertyName?: string
        //cql过滤条件
        cql_filter?: string
        //返回结果的格式
        info_format?: string
        //返回要素的最大数量默认是1
        feature_count?: number
        //报错时报错信息的格式
        exceptions?: "text/plain" | "application/vnd.ogc.gml" | "application/vnd.ogc.gml/3.1.1" | "text/html" | "application/json" | "text/javascript"
    } | {
        version?: Extract<WmsVersion, "1.3.0">
        layers?: string
        styles?: string
        //坐标系（WMS 1.3.0 +）
        crs?: string
        bbox?: string
        //返回地图图片的宽度（点选查询的时候用不到）
        width?: string
  // ... 其余字段见 lib/interface/wms.ts
}
```

## `IWcs`（`wcs.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### interface `GetCapabilitiesResponse`

```ts
export interface GetCapabilitiesResponse {
            [key: string]: unknown
        }
    }

    export namespace DescribeCoverage {
        export interface Response {
            [key: string]: unknown
        }
    }

    export interface DescribeCoverageParameters {
        version?: WcsVersion;
        coverage?: string;
        identifiers?: string;
        coverageId?: string;
    }

    export interface GetCoverageParameters {
        version?: WcsVersion;
        coverage?: string;
        identifiers?: string;
        coverageId?: string;
        format?: WcsFormats | string;
        bbox?: string;
        boundingbox?: string;
        crs?: string;
        responseCRS?: string;
        width?: string | number;
        height?: string | number;
        subset?: string | string[];
        rangesubset?: string;
        interpolation?: string;
        store?: boolean | string;
        extension?: Record<string, string | number | undefined>;
        headers?: Record<string, string>;
    }

    export type WcsFormats =
        | "GeoTIFF"
        | "image/tiff"
        | "image/geotiff"
        | "application/gml+xml"
        | "application/json"
        | "image/png"
}
```

## `IWps`（`wps.ts`）

共约 1 个导出类型/接口/枚举，下方摘录常用项。

### interface `WpsCapabilitiesResponse`

```ts
export interface WpsCapabilitiesResponse {
            Capabilities: {
                xmlns_xs: stringExtension;
                xmlns_ows: stringExtension;
                xmlns_wps: stringExtension;
                xmlns_xlink: stringExtension;
                xmlns_xsi: stringExtension;
                xml_lang: stringExtension;
                service: stringExtension;
                version: stringExtension;
                xsi_schemaLocation: stringExtension;
                ServiceIdentification: {
                    Title: stringExtension;
                    Abstract: stringExtension;
                    ServiceType: stringExtension;
                    ServiceTypeVersion: stringExtension;
                };
                ServiceProvider: {
                    ProviderName: stringExtension;
                    ProviderSite: stringExtension;
                    ServiceContact: unknown;
                };
                OperationsMetadata: {
                    Operation: Operation[];
                };
                ProcessOfferings: ProcessOfferings;
                Languages: {
                    Default: Language;
                    Supported: Language[];
                };
            }
        }
        interface Operation {
            name: stringExtension;
            // 这里可以添加Operation的具体属性，如果有的话
        }
        interface ProcessOfferings {
            // 这里可以添加ProcessOfferings的具体属性，如果有的话
        }
        interface Language {
            Language: stringExtension;
        }
    }
    export namespace DescribeProcess {
        interface stringExtension {
            __text: string
            __prefix: string
            toString: () => string
        }
        export interface DescribeProcessResponse {
            ProcessDescriptions: {
                _xmlns_xs: stringExtension;
                _xmlns_ows: stringExtension;
                _xmlns_wps: stringExtension;
                _xmlns_xlink: stringExtension;
  // ... 其余字段见 lib/interface/wps.ts
}
```

