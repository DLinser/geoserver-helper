// * 图层模块
export namespace ILayer {
    //图层源
    export interface LayerSourceInfo {
        //名称
        name: string
        // 类型
        '@class': string
        //详情地址
        href: string
    }
    //图层默认样式
    export interface LayerDefaultStyle {
        //名称
        name: string
        // 工作空间
        workspace?: string
        //详情地址
        href: string
    }
    export interface LayerSourceAttributeInfo {
        name: string
        minOccurs: number
        maxOccurs: number
        nillable: boolean
        binding: string
    }

    // 栅格图层的波段信息
    export interface ICoverageDimension {
        description: string
        dimensionType: {
            name: string
        }
        name: string
        range: {
            min: string
            max: string
        }
        unit: string
    }
    //图层源详细
    export interface LayerSourceDetailInfo {
        //矢量源
        featureType?: {
            name: string
            nativeName: string
            namespace: {
                name: string
                href: string
            }
            title: string
            srs: string
            nativeBoundingBox: {
                minx: number
                maxx: number
                miny: number
                maxy: number
                crs: number
            }
            latLonBoundingBox: {
                minx: number
                maxx: number
                miny: number
                maxy: number
                crs: number
            }
            enabled: boolean
            attributes: {
                attribute: LayerSourceAttributeInfo[]
            }
        }
        //栅格源
        coverage?: {
            name: string
            nativeName: string
            namespace: {
                name: string
                href: string
            }
            dimensions: {
                coverageDimension: ICoverageDimension[] | ICoverageDimension
            }
            title: string
            srs: string
            nativeBoundingBox: {
                minx: number
                maxx: number
                miny: number
                maxy: number
                crs:
                | string
                | {
                    '@class': string
                    $: string
                }
            }
            latLonBoundingBox: {
                minx: number
                maxx: number
                miny: number
                maxy: number
                crs: string
            }
            enabled: boolean
            attributes: {
                attribute: {
                    name: string
                    minOccurs: number
                    maxOccurs: number
                    nillable: boolean
                    binding: string
                }[]
            }
        }
    }

    //图层详情
    export interface LayerInfo {
        //名称
        name: string
        //属性
        attribution: {
            logoHeight: number
            logoWidth: number
        }
        // 类型  "VECTOR"
        type: string
        //创建时间
        dateCreated: string
        //修改时间
        dateModified: string
        //是否是不透明的
        opaque: boolean
        //是否可查询
        queryable: boolean
        //图层源
        resource: LayerSourceInfo
        //样式
        defaultStyle: LayerDefaultStyle
    }

    //图层字段信息
    export interface LayerFieldProperties {
        localType: string
        maxOccurs: number
        minOccurs: number
        name: string
        nillable: boolean
        type: string
    }
    export interface LayerDescribeFeatureType {
        elementFormDefault: string
        // 字段类型
        featureTypes: {
            //图层名
            typeName: string
            properties: LayerFieldProperties[]
        }[]
        //命名空间
        targetNamespace: string
        //前缀，此处是指工作空间
        targetPrefix: LayerSourceInfo
    }
    //图层属性表信息
    export interface LayerPropertySheetInfo {
        type: string
        crs: {
            properties: {
                name: string
            }
            type: string
        }
        bbox?: [number, number, number, number],
        // 要素总数
        totalFeatures: number
        // 当前查询时间
        timeStamp: string
        // 返回数据的数量
        numberReturned: number
        // 符合查询条件的数量
        numberMatched: number
        // 查询出的要素
        features: {
            id: string
            //空间字段名
            geometry_name: string
            //几何信息
            geometry: {
                coordinates: any
                type: string
            }
            type: string
            properties: Record<string, any>
        }[]
        //命名空间
        targetNamespace: string
        //前缀，此处是指工作空间
        targetPrefix: LayerSourceInfo
    }
    //返回结果单项
    export interface ResLayerListItem {
        name: string
    }
    //接口返回的图层详情结果
    export interface ResLayerInfo {
        layer: LayerInfo
    }
    //查询的工作空间列表结果
    export interface ResLayerList {
        layers: {
            layer: ResLayerListItem[]
        }
    }
    export interface LayerModifyInfo {
        name?: string
        path?: string
        type?: string
        defaultStyle?: {
            name: string
        }
        styles?: {
            '@class': string
            style: [
                {
                    name: string
                },
            ]
        }
        resource?: {
            '@class': 'featureType'
            name: string
        }
        opaque?: true
        metadata?: [
            {
                '@key': string
                $: string
            },
        ]
        attribution?: {
            title: string
            href: string
            logoURL: string
            logoWidth: number
            logoHeight: number
            logoType: string
        }
        authorityURLs?: {
            name: string
            href: string
        }[]
        identifiers?: {
            authority: string
            identifier: string
        }[]
    }

    export interface ILayerCacheTasks {
        'long-array-array': string[]
    }

    //图层WFS的GetPropertyValue查询结果
    export interface LayerPropertyValue {
        ValueCollection: {
            member: Record<string, {
                __prefix: string;
                __text: string;
                toString(): string;
            }>[]
        }
    }
}
