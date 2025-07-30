export namespace IWms {
    export type WmsVersion = "1.0.0" | "1.1.0" | "1.1.1" | "1.3.0"
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
            Name: string;
            Title?: string;
            Abstract?: string;
            KeywordList?: {
                Keyword: string[];
            };
            OnlineResource: string;
            ContactInformation: ContactInformation;
            Fees?: string;
            AccessConstraints?: string[];
        }

        interface Format {
            $value: string;
        }

        interface DCPType {
            HTTP: {
                Get: {
                    OnlineResource: string
                };
                Post?: {
                    OnlineResource: string
                };
            };
        }

        interface Operation {
            Format: Format[];
            DCPType: DCPType[];
        }
        interface Layer {
            Name: string;
            Title: string;
            Abstract: string;
            KeywordList: string[];
            BoundingBox: {
                crs: string | null;
                extent: [number, number, number, number];
                res: [number | null, number | null];
            }[];
            Style: {
                Name: string;
                Title: string;
                Abstract: string;
                LegendURL: {
                    Format: string;
                    OnlineResource: string;
                    size: [number, number];
                }[];
            }[];
            queryable: boolean;
            opaque: boolean;
            noSubsets: boolean;
        }

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
        //返回地图图片的高度（点选查询的时候用不到）
        height?: string
        //经度WMS 1.3.0
        i?: string
        //纬度WMS 1.3.0
        j?: string
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
    }

    export namespace GetLegendGraphic {
        export interface QueryParameters {
            service?: "WMS",
            version?: WmsVersion,
            request?: "GetLegendGraphic",
            layer?: string,
            format?: "application/json" | WmsFormats
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
            "stroke-linecap?": string
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        export interface Response {
            Legend: LegendItem[]
        }
    }

    /**
     * wms服务支持的类型
     */
    export type WmsFormats = 'image/png' | 'image/png8' | 'image/jpeg' | 'image/vnd.jpeg-png' | 'image/vnd.jpeg-png8' | 'image/gif' | 'image/tiff' | 'tiff8' | 'image/geotiff' | 'image/geotiff8' | 'image/svg' | 'application/pdf' | 'rss' | 'kml' | 'kmz' | 'text/mapml' | 'text/html; subtype=mapml' | 'application/openlayers' | 'application/json;type=utfgrid'
}
