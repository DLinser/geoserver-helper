import X2JS from "x2js";
import { formateObjToParamStr } from "./utils/common";
import { IWcs } from "./interface/wcs";

const x2js = new X2JS();

function buildQueryUrl(
  url: string,
  params: Record<string, string | number | undefined>,
) {
  return `${url}${url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(params)}`;
}

async function parseWcsResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }
  if (
    contentType.includes("text/") ||
    contentType.includes("xml") ||
    contentType.includes("gml")
  ) {
    return response.text();
  }
  return response.blob();
}

export default class wcsHelper {
  url: string = "";
  layer: string = "";
  srsName: string = "EPSG:4326";
  workspace: string = "";
  constructor(options: {
    url: string;
    layer?: string;
    srsName?: string;
    workspace?: string;
  }) {
    if (!options) return;
    this.url = options.url;
    this.layer = options.layer || "";
    this.srsName = options.srsName || "EPSG:4326";
    this.workspace = options.workspace || "";
  }

  private getCurrentCoverageName() {
    return this.workspace ? `${this.workspace}:${this.layer}` : this.layer;
  }

  private formatDescribeCoverageParams(
    option: IWcs.DescribeCoverageParameters,
  ) {
    const version = option.version || "2.0.1";
    const currentCoverageName =
      option.coverage ||
      option.identifiers ||
      option.coverageId ||
      this.getCurrentCoverageName();

    if (version === "2.0.1") {
      return {
        service: "WCS",
        version,
        request: "DescribeCoverage",
        coverageId: option.coverageId || currentCoverageName,
      };
    }

    if (version === "1.1.0" || version === "1.1.1") {
      return {
        service: "WCS",
        version,
        request: "DescribeCoverage",
        identifiers: option.identifiers || currentCoverageName,
      };
    }

    return {
      service: "WCS",
      version,
      request: "DescribeCoverage",
      coverage: option.coverage || currentCoverageName,
    };
  }

  private formatGetCoverageParams(option: IWcs.GetCoverageParameters) {
    const version = option.version || "2.0.1";
    const currentCoverageName =
      option.coverage ||
      option.identifiers ||
      option.coverageId ||
      this.getCurrentCoverageName();
    const commonParams = {
      service: "WCS",
      version,
      request: "GetCoverage",
      format: option.format || "GeoTIFF",
      ...(option.extension || {}),
    };

    if (version === "2.0.1") {
      return {
        ...commonParams,
        coverageId: option.coverageId || currentCoverageName,
        subset: Array.isArray(option.subset)
          ? option.subset.join(",")
          : option.subset,
        rangesubset: option.rangesubset,
      };
    }

    if (version === "1.1.0" || version === "1.1.1") {
      return {
        ...commonParams,
        identifiers: option.identifiers || currentCoverageName,
        boundingbox: option.boundingbox || option.bbox,
        width: option.width,
        height: option.height,
        store: option.store !== undefined ? String(option.store) : undefined,
      };
    }

    return {
      ...commonParams,
      coverage: option.coverage || currentCoverageName,
      bbox: option.bbox,
      crs: option.crs || this.srsName,
      responseCRS: option.responseCRS,
      width: option.width,
      height: option.height,
      interpolation: option.interpolation,
    };
  }

  /**
   * 获取wcs能力集
   * @example
   * import wcsHelper from 'geoserver-helper/wcs'
   * const wcsHelperInstance = new wcsHelper({
   *   url: "/geoserver/wcs",
   * });
   * wcsHelperInstance.GetCapabilities({
   *   version: "2.0.1",
   * }).then(res => {
   *   console.log(res)
   * })
   * @return {IWcs.WCSCapabilities.GetCapabilitiesResponse} 能力集
   */
  GetCapabilities(
    option: {
      version: IWcs.WcsVersion;
    } = {
      version: "2.0.1",
    },
  ) {
    const requestParams = {
      service: "WCS",
      version: option.version,
      request: "GetCapabilities",
    };
    const fetchUrl = buildQueryUrl(this.url, requestParams);
    return new Promise<IWcs.WCSCapabilities.GetCapabilitiesResponse>(
      (resolve, reject) => {
        fetch(fetchUrl, {
          method: "GET",
          headers: new Headers({
            Accept: "application/xml, text/xml, application/json",
          }),
          mode: "cors",
        })
          .then((res) => res.text())
          .then((xmlString) => {
            resolve(
              x2js.xml2js<IWcs.WCSCapabilities.GetCapabilitiesResponse>(
                xmlString,
              ),
            );
          })
          .catch((err) => {
            reject(err);
          });
      },
    );
  }

  /**
   * 查询栅格覆盖描述信息
   * @example
   * import wcsHelper from 'geoserver-helper/wcs'
   * const wcsHelperInstance = new wcsHelper({
   *   url: "/geoserver/wcs",
   * });
   * wcsHelperInstance.DescribeCoverage({
   *   version: "2.0.1",
   *   coverage: "nurc:Pk50095",
   * }).then(res => {
   *   console.log(res)
   * })
   * @return {IWcs.DescribeCoverage.Response} 覆盖描述
   */
  DescribeCoverage(option: IWcs.DescribeCoverageParameters = {}) {
    const requestParams = this.formatDescribeCoverageParams(option);
    const fetchUrl = buildQueryUrl(this.url, requestParams);
    return new Promise<IWcs.DescribeCoverage.Response>((resolve, reject) => {
      fetch(fetchUrl, {
        method: "GET",
        headers: new Headers({
          Accept: "application/xml, text/xml, application/json",
        }),
        mode: "cors",
      })
        .then((res) => res.text())
        .then((xmlString) => {
          resolve(x2js.xml2js<IWcs.DescribeCoverage.Response>(xmlString));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * 获取GetCoverage的完整请求地址
   * @param {IWcs.GetCoverageParameters} option
   * @return {string}
   */
  GetCoverageUrl(option: IWcs.GetCoverageParameters) {
    const requestParams = this.formatGetCoverageParams(option);
    return buildQueryUrl(this.url, requestParams);
  }

  /**
   * 请求栅格覆盖数据
   * @param {IWcs.GetCoverageParameters} option
   * @example
   * import wcsHelper from 'geoserver-helper/wcs'
   * const wcsHelperInstance = new wcsHelper({
   *   url: "/geoserver/wcs",
   * });
   * wcsHelperInstance.GetCoverage({
   *   version: "2.0.1",
   *   coverage: "nurc:Pk50095",
   *   format: "GeoTIFF"
   * }).then(res => {
   *   console.log(res)
   * })
   * @return {Promise<Blob | string | any>} 栅格结果
   */
  async GetCoverage(option: IWcs.GetCoverageParameters) {
    const fetchUrl = this.GetCoverageUrl(option);
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: new Headers(option.headers || {}),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(
        `WCS GetCoverage request failed with status ${response.status}`,
      );
    }

    return parseWcsResponse(response);
  }
}
