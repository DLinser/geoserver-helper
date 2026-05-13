export namespace IWcs {
    export type WcsVersion = "1.0.0" | "1.1.0" | "1.1.1" | "2.0.1"

    export namespace WCSCapabilities {
        export interface GetCapabilitiesResponse {
            [key: string]: any
        }
    }

    export namespace DescribeCoverage {
        export interface Response {
            [key: string]: any
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
