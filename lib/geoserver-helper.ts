import wpsHelper from "./wps";
import wfsHelper from "./wfs";
import wmsHelper from "./wms";
import restHelper from "./rest";
import utils from "./utils/utils";
export function sum(a: number, b: number): number {
  return a + b;
}

export default {
  wpsHelper,
  wfsHelper,
  wmsHelper,
  restHelper,
  utils,
  sum
};
