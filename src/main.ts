import './style.css'
import geoserverRest from '../lib/geoserver-helper'
import fetchUtil from '../lib/utils/fetch'
import restHelper from '../lib/rest'
import wfsHelper from '../lib/wfs'
import wmsHelper from '../lib/wms'
import Feature from 'ol/Feature'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Geoserver Helper</h1>
    <div class="card">
      <h2>geoserverRest</h2>
      ${Object.getOwnPropertyNames(geoserverRest)}
      <h2>restHelper</h2>
      ${Object.getOwnPropertyNames(restHelper)}
      <h2>wfsHelper</h2>
      ${Object.getOwnPropertyNames(wfsHelper)}
      <h2>wmsHelper</h2>
      ${Object.getOwnPropertyNames(wmsHelper)}
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`
const cc = geoserverRest.sum(1, 6)
console.log(cc)

const wpsHelper = new geoserverRest.wpsHelper("/geoserver/ows",);
const wfsHelperInstance = new wfsHelper({
  url: "/geoserver/wfs",
  workspace: "qhd",
  userName: "admin",
  password: "geoserver",
});
const wmsHelperInstance = new wmsHelper({
  url: "/geoserver/wms",
  workspace: "qhd",
});

const countXml = wpsHelper.formatFeatureCountXmlString({
  workspace: "qhd",
  workspaceURI: "http://qhd",
  queryName: "qhd:xzqh_xian",
  cql: "gb like '1561303%'",
});
const finishXmlString = wpsHelper.finishXML(countXml);
const wpsurl = `/geoserver/ows?service=WPS&version=1.0.0`;

// fetchUtil.post<string>(wpsurl, finishXmlString).then((res2) => {
//   if (res2) {
//     const jsonRes = JSON.parse(res2);
//     debugger;
//     console.log(jsonRes)
//   }
// });
const restHelperInstance = new restHelper({
  url: "/geoserver"
})
// restHelperInstance.getLayerListApi("").then(res => {
//   debugger
//   res.layers
//   console.log(res)
// })

// restHelperInstance.getStylesListApi().then(res => {
//   debugger
//   console.log(res)
// })

// restHelperInstance.getLayerInfoApi("qhd:xzqh_shi").then(res => {
//   debugger
//   res.layer
//   console.log(res)
// })
// restHelperInstance.getWorkspaceListApi().then(res => {
//   debugger
//   console.log(res)
// })
// restHelperInstance.getWorkspaceInfoApi("qhd").then(res => {
//   debugger
//   console.log(res)
// })

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

// wfsHelperInstance.GetFeatureByPost({
//   // "workspace": "qhd", 
//   // "workspaceUri": "http://qhd", 
//   "typename": "qhd:永久基本农田",
//   "startIndex": 0,
//   "maxFeatures": 10,
//   "cql": "type = '种植非粮食作' AND INTERSECTS (the_geom, MULTIPOLYGON(((119.149559 40.60191,119.1549 40.597565,119.176018 40.609817,119.220772 40.604893,119.233978 40.599148,119.230072 40.591,119.218658 40.583031,119.213371 40.568497,119.223946 40.557297,119.248894 40.545918,119.252831 40.534538,119.263336 40.534538,119.27034 40.539352,119.285217 40.535851,119.289154 40.525787,119.318046 40.534538,119.331215 40.526489,119.337555 40.534149,119.371902 40.548153,119.385376 40.541019,119.376923 40.532036,119.385376 40.523846,119.397263 40.525433,119.397797 40.534679,119.429497 40.541283,119.437958 40.531773,119.445877 40.529396,119.454864 40.536793,119.467018 40.533356,119.477852 40.522789,119.495552 40.552116,119.512726 40.545776,119.527519 40.552116,119.537559 40.547359,119.545227 40.536793,119.56002 40.533356,119.560288 40.527546,119.5476 40.521469,119.539413 40.509842,119.543907 40.503765,119.557381 40.499802,119.559494 40.490818,119.555 40.487122,119.591873 40.463696,119.592705 40.446678,119.58036 40.435505,119.583199 40.426331,119.590538 40.423161,119.586533 40.413151,119.590538 40.405643,119.587204 40.391464,119.576858 40.387463,119.57119 40.375786,119.596046 40.361443,119.5802 40.342091,119.601883 40.331749,119.60672 40.325912,119.604669 40.317935,119.607521 40.303299,119.634819 40.289227,119.644386 40.270653,119.627502 40.249828,119.615684 40.224781,119.622719 40.221123,119.632004 40.229847,119.64045 40.227596,119.663284 40.237644,119.675377 40.214886,119.741424 40.189537,119.746323 40.179329,119.748688 40.13353,119.745018 40.119858,119.73261 40.110055,119.726784 40.103367,119.746963 40.086872,119.764038 40.08086,119.751618 40.065723,119.76326 40.046906,119.768112 40.049038,119.787705 40.037979,119.804199 40.044384,119.809242 40.050785,119.816421 40.045933,119.827675 40.048264,119.836792 40.035652,119.846687 40.030411,119.841644 40.015861,119.832329 40.004993,119.846569 39.989752,119.832522 39.978163,119.800009 39.977045,119.779168 39.953864,119.749679 39.952653,119.715909 39.941764,119.710464 39.9354,119.673882 39.936534,119.616414 39.910702,119.564879 39.907486,119.530626 39.886057,119.519661 39.848871,119.529785 39.825962,119.521555 39.814218,119.461217 39.811609,119.422995 39.790527,119.403799 39.785407,119.410992 39.779109,119.360283 39.74342,119.344657 39.720188,119.299806 39.610889,119.254963 39.518359,119.265487 39.490409,119.294832 39.460458,119.304738 39.432423,119.278771 39.422313,119.265356 39.422289,119.245853 39.432034,119.217943 39.454679,119.188943 39.456452,119.161939 39.470229,119.128479 39.461609,119.063702 39.475975,119.048055 39.461343,119.03813 39.459519,118.998835 39.466265,119.001552 39.475255,119.00954 39.480633,119.005887 39.504059,119.001248 39.508034,118.954887 39.51663,118.960982 39.52676,118.977074 39.531145,118.977338 39.537792,118.939372 39.543715,118.93828 39.557155,118.889345 39.545988,118.879355 39.551335,118.876233 39.565845,118.855477 39.573681,118.853252 39.585635,118.845464 39.589111,118.841489 39.605109,118.845635 39.623471,118.818808 39.648197,118.822011 39.651807,118.819096 39.661867,118.816274 39.667818,118.807534 39.669873,118.798143 39.678749,118.788944 39.696349,118.785584 39.715398,118.78055 39.714579,118.778318 39.720338,118.769659 39.76244,118.773142 39.766841,118.788117 39.769497,118.793971 39.772491,118.792914 39.789686,118.818645 39.795999,118.810431 39.806391,118.810283 39.821566,118.820677 39.835158,118.825628 39.858912,118.830487 39.864065,118.847647 39.880369,118.860226 39.929716,118.874666 39.93601,118.881879 39.950854,118.877489 40.006053,118.858017 40.029328,118.863675 40.047678,118.857315 40.05796,118.89978 40.088468,118.914995 40.09039,118.922309 40.099687,118.917339 40.111822,118.919415 40.123634,118.91459 40.126392,118.918723 40.148092,118.903102 40.157807,118.90736 40.163901,118.904083 40.168099,118.883735 40.166817,118.856853 40.180922,118.823392 40.17826,118.811611 40.191403,118.780487 40.210833,118.770611 40.19302,118.73746 40.190118,118.739971 40.206816,118.73375 40.211572,118.719947 40.212078,118.709967 40.217755,118.701508 40.214815,118.670459 40.233153,118.657083 40.246002,118.621695 40.251827,118.602864 40.253188,118.607531 40.261304,118.599562 40.266368,118.588271 40.268759,118.579893 40.26269,118.566839 40.266188,118.561579 40.283125,118.569071 40.291214,118.579156 40.288133,118.58023 40.292605,118.568927 40.295067,118.571795 40.307043,118.591115 40.307522,118.604281 40.318738,118.605963 40.328389,118.630807 40.347774,118.634156 40.361317,118.646426 40.369912,118.62369 40.394089,118.627944 40.413543,118.614098 40.414364,118.603256 40.427464,118.630027 40.448781,118.65745 40.44697,118.673615 40.473561,118.693652 40.490125,118.717377 40.472421,118.766814 40.478362,118.786013 40.491047,118.784264 40.494744,118.793681 40.515218,118.815264 40.530627,118.856845 40.526584,118.881505 40.541217,118.913412 40.529627,118.933496 40.532633,118.953014 40.530044,118.959969 40.535291,118.950573 40.555249,118.976905 40.564074,118.979504 40.571815,118.988988 40.576539,119.0048 40.576332,119.016525 40.58604,119.030211 40.588089,119.05653 40.604458,119.06442 40.603744,119.071406 40.589348,119.080853 40.587095,119.102418 40.601993,119.128527 40.60387,119.142868 40.612839,119.150567 40.612963,119.149559 40.60191))))"
// }).then(res => {
//   debugger
//   console.log(res)
// })

// wfsHelperInstance.GetFeature({
//   propertyname: "name,gb",
//   typename: "qhd:xzqh_xian",

// }).then(res => {
//   debugger
//   console.log(res)
// })

// wfsHelperInstance.DescribeFeatureType({
//   typeName: "topp:states",
// }).then(res => {
//   debugger
//   console.log(res)
// })

// wfsHelperInstance.GetCapabilities({
//   version: "1.0.0",
// }).then(res => {
//   debugger
//   console.log(res)
// })

// wfsHelperInstance.GetPropertyValue({
//   typeNames: "topp:states",
//   valueReference: "STATE_NAME"
// }).then(res => {
//   debugger
//   console.log(res)
// })
const feature = new Feature({
  备注: "呼高81米，档距575米"
})
feature.setId("jiquanxian_1045_2.353")
// wfsHelperInstance.Transaction({
//   type: "modif",
//   featurePrefix: "data",
//   featureNS: "http://192.168.0.110:8082/data",
//   featureType: "data:jiquanxian_1045_2",
//   srsName: 'EPSG:4326',
//   features: [feature as any],
// }).then(res => {
//   debugger
//   console.log(res)
// })
wfsHelperInstance.Transaction({
  type: "create",
  featurePrefix: "qhd",
  featureNS: "http://qhd",
  featureType: "qhd:yh2",
  srsName: 'EPSG:4326',
  features: [feature as any],
}).then(res => {
  debugger
  console.log(res)
})

// wmsHelperInstance.GetCapabilities({
//   version: "1.0.0"
// }).then(res => {
//   debugger
//   console.log(res)
// })

// wmsHelperInstance.GetFeatureInfo({
//   layers: "ellip_visual:1000510942192095232",
//   version: "1.1.1",
//   bbox: "118.85559,39.47113,119.17419,39.776",
//   srs: "EPSG:4326"
// }).then(res => {
//   debugger
//   console.log(res)
// })

// wmsHelperInstance.GetLegendGraphic({
//   layer: "ellip_visual:1000510942192095232",
// }).then(res => {
//   debugger
//   console.log(res)
// })

// wpsHelper.GetCapabilities().then(res => {
//   debugger
//   console.log(res)
// })
// wpsHelper.DescribeProcess({
//   identifier: "JTS:buffer"
// }).then(res => {
//   debugger
//   console.log(res)
// })
