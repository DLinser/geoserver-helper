export namespace IWms {
    export type WmsVersion = "1.0.0" | "1.1.0" | "1.1.1" | "1.3.0"
    /**
     * GetMap / GetFeatureInfo 共用的可选 vendor 与扩展参数。
     * 未列出的键可通过 extension 透传。
     */
    export interface WmsCommonOptionalParameters {
        // cql 过滤条件
        cql_filter?: string
        time?: string
        elevation?: string
        env?: string
        transparent?: boolean | string
        bgcolor?: string
        sld?: string
        sld_body?: string
        filter?: string
        viewparams?: string
        // 报错时报错信息的格式
        exceptions?: "text/plain" | "application/vnd.ogc.se_xml" | "application/vnd.ogc.se_inimage" | "application/vnd.ogc.se_blank" | "application/vnd.ogc.gml" | "application/vnd.ogc.gml/3.1.1" | "text/xml" | "text/html" | "application/json" | "text/javascript"
        extension?: Record<string, string | number | undefined>
    }

    export namespace WMSCapabilities {
        interface ContactInformation {
            ContactPersonPrimary?: {
                ContactPerson?: string;
                ContactOrganization?: string;
            };
            ContactPosition?: string;
            ContactAddress?: {
                AddressType?: string;
                Address?: string;
                City?: string;
                StateOrProvince?: string;
                PostCode?: string;
                Country?: string;
            };
            ContactVoiceTelephone?: string;
            ContactFacsimileTelephone?: string;
            ContactElectronicMailAddress?: string;
        }

        interface Service {
            Name?: string;
            Title?: string;
            Abstract?: string;
            // OpenLayers 会把 Keyword 收成 string[]，与 Layer 一致
            KeywordList?: string[];
            OnlineResource?: string;
            ContactInformation?: ContactInformation;
            Fees?: string;
            AccessConstraints?: string;
            LayerLimit?: number;
            MaxWidth?: number;
            MaxHeight?: number;
        }

        interface Operation {
            Format?: string[];
            DCPType?: {
                HTTP?: {
                    Get?: {
                        OnlineResource?: string
                    };
                    Post?: {
                        OnlineResource?: string
                    };
                };
            }[];
        }

        /**
         * 对应 ol/format/WMSCapabilities 解析出的图层（含根图层）。
         * 分组图层通常没有 Name；子图层可通过 Layer 嵌套。
         */
        interface Layer {
            Name?: string;
            Title?: string;
            Abstract?: string;
            KeywordList?: string[];
            CRS?: string[];
            EX_GeographicBoundingBox?: [number, number, number, number];
            BoundingBox?: {
                crs: string | null;
                extent: [number | null, number | null, number | null, number | null];
                res: [number | null, number | null];
            }[];
            Style?: {
                Name?: string;
                Title?: string;
                Abstract?: string;
                LegendURL?: {
                    Format?: string;
                    OnlineResource?: string;
                    size?: [number | undefined, number | undefined];
                }[];
            }[];
            queryable?: boolean;
            opaque?: boolean;
            noSubsets?: boolean;
            cascaded?: number;
            fixedWidth?: number;
            fixedHeight?: number;
            MinScaleDenominator?: number;
            MaxScaleDenominator?: number;
            Dimension?: {
                name?: string | null;
                units?: string | null;
                unitSymbol?: string | null;
                default?: string | null;
                multipleValues?: boolean;
                nearestValue?: boolean;
                current?: boolean;
                values?: string;
            }[];
            Layer?: Layer[];
        }

        /**
         * 对应 ol/format/WMSCapabilities 的解析结果。
         * Request 只会包含 OpenLayers 实际解析的 GetCapabilities / GetMap / GetFeatureInfo；
         * XML 里的 DescribeLayer、GetLegendGraphic、GetStyles 不会出现在该对象上。
         */
        export interface GetCapabilitiesResponse {
            Service: Service;
            Capability: {
                Request: {
                    GetCapabilities?: Operation;
                    GetMap?: Operation;
                    GetFeatureInfo?: Operation;
                };
                Exception?: string[];
                Layer?: Layer;
            };
            version: string
        }
    }

    /**
     * GetFeatureInfo 与版本无关的公共字段。
     * layers、bbox、width、height 在规范中为必填；layers 未传时回退到实例上的 workspace:layer。
     * query_layers 未传时默认等于 layers。styles 未传时按空字符串发送（规范仍要求该参数）。
     * 坐标系未传时默认使用实例 srsName。
     */
    export interface GetFeatureInfoCommonParameters extends WmsCommonOptionalParameters {
        service?: "WMS"
        request?: "GetFeatureInfo"
        layers?: string
        /** 查询图层，默认等于 layers */
        query_layers?: string
        styles?: string
        bbox: string
        /** 与对应 GetMap 出图请求一致的像素宽度，规范必填 */
        width: string | number
        /** 与对应 GetMap 出图请求一致的像素高度，规范必填 */
        height: string | number
        /** 对应出图请求的 format，可选 */
        format?: WmsFormats | string
        // 返回结果有哪些字段，默认返回全部
        propertyName?: string
        // 返回结果的格式
        info_format?: "text/plain" | "application/vnd.ogc.gml" | "application/vnd.ogc.gml/3.1.1" | "text/xml" | "text/html" | "application/json" | "text/javascript"
        // 返回要素的最大数量，服务端默认通常是 1
        feature_count?: number
        buffer?: string | number
        feature_id?: string
    }

    export type GetFeatureInfoParameters = (GetFeatureInfoCommonParameters & {
        version?: Extract<WmsVersion, "1.0.0" | "1.1.0" | "1.1.1">
        /** 坐标系，默认使用实例 srsName */
        srs?: string
        /** 查询点的像素列（从左起），不是经度 */
        x: string | number
        /** 查询点的像素行（从上起），不是纬度 */
        y: string | number
    }) | (GetFeatureInfoCommonParameters & {
        version: Extract<WmsVersion, "1.3.0">
        /** 坐标系，默认使用实例 srsName。EPSG:4326 在 1.3.0 下 bbox 轴序为纬度,经度 */
        crs?: string
        /** 查询点的像素列（从左起），不是经度 */
        i: string | number
        /** 查询点的像素行（从上起），不是纬度 */
        j: string | number
    })

    /**
     * GetMap 与版本无关的公共字段。
     * layers、styles、bbox、width、height、format 在规范中为必填；
     * layers 未传时回退到实例上的 workspace:layer，styles 默认空字符串，format 默认 image/png。
     */
    export interface GetMapCommonParameters extends WmsCommonOptionalParameters {
        service?: "WMS"
        request?: "GetMap"
        layers?: string
        styles?: string
        bbox: string
        width: string | number
        height: string | number
        format?: WmsFormats | string
        headers?: Record<string, string>
    }

    export type GetMapParameters = (GetMapCommonParameters & {
        version?: Extract<WmsVersion, "1.0.0" | "1.1.0" | "1.1.1">
        /** 坐标系，默认使用实例 srsName */
        srs?: string
    }) | (GetMapCommonParameters & {
        version: Extract<WmsVersion, "1.3.0">
        /** 坐标系，默认使用实例 srsName。EPSG:4326 在 1.3.0 下 bbox 轴序为纬度,经度 */
        crs?: string
    })

    export namespace GetLegendGraphic {
        export interface QueryParameters {
            service?: "WMS"
            version?: WmsVersion
            request?: "GetLegendGraphic"
            layer?: string
            format?: "application/json" | WmsFormats
            style?: string
            rule?: string
            scale?: string | number
            width?: string | number
            height?: string | number
            transparent?: boolean | string
            exceptions?: WmsCommonOptionalParameters["exceptions"]
            sld?: string
            sld_body?: string
            legend_options?: string
        }
        export interface LegendItem {
            layerId: string
            layerName: string
            title: string
            hideState?: boolean
            rules: LegendRule[]
        }

        export interface LegendRule {
            name: string
            title: string
            abstract: string
            hide?: boolean
            filter: string
            symbolizers: LegendSymbolizer[]
        }

        export interface LegendSymbolizer {
            Point?: LegendPointSymbolizer
            Line?: LegendLineSymbolizer
            Polygon?: LegendPolygonSymbolizer
            Raster?: LegendRasterSymbolizer
        }

        export interface LegendPointSymbolizer {
            title: string
            abstract: string
            url: string
            size: string
            opacity: string
            rotation: string
            graphics: Graphic[]
        }

        export interface LegendLineSymbolizer {
            stroke: string
            "stroke-opacity"?: string
            "stroke-width"?: string
            "stroke-linecap"?: string
            "stroke-linejoin"?: string
        }

        export interface LegendPolygonSymbolizer {
            fill: string
            "fill-opacity"?: string
            stroke?: string
            "stroke-linecap"?: string
            "stroke-linejoin"?: string
            "stroke-opacity"?: string
            "stroke-width"?: number
        }

        export interface LegendRasterSymbolizer {
            colormap: {
                entries: {
                    color: string
                    label: string
                    opacity: string
                    quantity: string
                }[]
                type: "ramp" | "intervals" | "values"
            }
        }

        export interface Graphic {
            mark: string
            fill: string
            "fill-opacity"?: string
            stroke?: string
            "stroke-width"?: string
            "stroke-opacity"?: string
            "stroke-linecap"?: string
            "stroke-linejoin"?: string
        }

        export interface Response {
            Legend: LegendItem[]
        }
    }

    /**
     * wms服务支持的类型
     */
    export type WmsFormats = 'image/png' | 'image/png8' | 'image/jpeg' | 'image/vnd.jpeg-png' | 'image/vnd.jpeg-png8' | 'image/gif' | 'image/tiff' | 'tiff8' | 'image/geotiff' | 'image/geotiff8' | 'image/svg' | 'application/pdf' | 'rss' | 'kml' | 'kmz' | 'text/mapml' | 'text/html; subtype=mapml' | 'application/openlayers' | 'application/json;type=utfgrid'
}
