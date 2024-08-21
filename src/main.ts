import './style.css'
import geoserverRest from '../lib/geoserver-helper'
import fetchUtil from '../lib/utils/fetch'
import restHelper, { ILayer } from '../lib/rest'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`
const cc = geoserverRest.sum(1, 6)
console.log(cc)

const wpsHelper = new geoserverRest.wpsHelper();
const countXml = wpsHelper.formatFeatureCountXmlString({
  workspace: "qhd",
  workspaceURI: "http://qhd",
  queryName: "qhd:xzqh_xian",
  cql: "gb like '1561303%'",
});
const finishXmlString = wpsHelper.finishXML(countXml);
const wpsurl = `/geoserver/ows?service=WPS&version=1.0.0`;

fetchUtil.post<string>(wpsurl, finishXmlString).then((res2) => {
  if (res2) {
    const jsonRes = JSON.parse(res2);
    debugger;
    console.log(jsonRes)
  }
});
const restHelperInstance = new restHelper({
  url: "/geoserver"
})
// restHelperInstance.getLayerListApi("qhd").then(res => {
//   debugger
//   res.layers
//   console.log(res)
// })

// restHelperInstance.getLayerInfoApi("qhd:xzqh_shi").then(res => {
//   debugger
//   res.layer
//   console.log(res)
// })
restHelperInstance.getWorkspaceListApi().then(res => {
  debugger
  console.log(res)
})
restHelperInstance.getWorkspaceInfoApi("qhd").then(res => {
  debugger
  console.log(res)
})

// const currentLayerModifyInfo: ILayer.LayerModifyInfo = {
//   defaultStyle: {
//     name: "qhd:xzqh_shi",
//     // name: "polygon",
//   },
// }
// restHelperInstance.modifyLayerApi(
//   "xzqh_shi",
//   currentLayerModifyInfo,
//   "qhd",
// ).then(res => {
//   debugger
// }).catch(e => {
//   debugger
// })