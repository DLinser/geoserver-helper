import "./style.css";
import geoserverRest from "../lib/geoserver-helper";
import fetchUtil from "../lib/utils/fetch";
import restHelper from "../lib/rest";
import wfsHelper from "../lib/wfs";
import wmsHelper from "../lib/wms";
import Feature from "ol/Feature";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
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
`;
const cc = geoserverRest.sum(1, 6);
console.log(cc);

const wpsHelper = new geoserverRest.wpsHelper("/geoserver/ows");
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
  url: "/geoserver",
  userName: "admin",
  password: "geoserver",
});
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

// wfsHelperInstance
//   .GetFeatureByPost({
//     // "workspace": "qhd",
//     // "workspaceUri": "http://qhd",
//     typename: "qhd:永久基本农田",
//     startIndex: 0,
//     maxFeatures: 10,
//     cql: "type = '种植非粮食作' AND INTERSECTS (the_geom, MULTIPOLYGON(((119.149559 40.60191,119.1549 40.597565,119.176018 40.609817,119.220772 40.604893,119.233978 40.599148,119.230072 40.591,119.218658 40.583031,119.213371 40.568497,119.223946 40.557297,119.248894 40.545918,119.252831 40.534538,119.263336 40.534538,119.27034 40.539352,119.285217 40.535851,119.289154 40.525787,119.318046 40.534538,119.331215 40.526489,119.337555 40.534149,119.371902 40.548153,119.385376 40.541019,119.376923 40.532036,119.385376 40.523846,119.397263 40.525433,119.397797 40.534679,119.429497 40.541283,119.437958 40.531773,119.445877 40.529396,119.454864 40.536793,119.467018 40.533356,119.477852 40.522789,119.495552 40.552116,119.512726 40.545776,119.527519 40.552116,119.537559 40.547359,119.545227 40.536793,119.56002 40.533356,119.560288 40.527546,119.5476 40.521469,119.539413 40.509842,119.543907 40.503765,119.557381 40.499802,119.559494 40.490818,119.555 40.487122,119.591873 40.463696,119.592705 40.446678,119.58036 40.435505,119.583199 40.426331,119.590538 40.423161,119.586533 40.413151,119.590538 40.405643,119.587204 40.391464,119.576858 40.387463,119.57119 40.375786,119.596046 40.361443,119.5802 40.342091,119.601883 40.331749,119.60672 40.325912,119.604669 40.317935,119.607521 40.303299,119.634819 40.289227,119.644386 40.270653,119.627502 40.249828,119.615684 40.224781,119.622719 40.221123,119.632004 40.229847,119.64045 40.227596,119.663284 40.237644,119.675377 40.214886,119.741424 40.189537,119.746323 40.179329,119.748688 40.13353,119.745018 40.119858,119.73261 40.110055,119.726784 40.103367,119.746963 40.086872,119.764038 40.08086,119.751618 40.065723,119.76326 40.046906,119.768112 40.049038,119.787705 40.037979,119.804199 40.044384,119.809242 40.050785,119.816421 40.045933,119.827675 40.048264,119.836792 40.035652,119.846687 40.030411,119.841644 40.015861,119.832329 40.004993,119.846569 39.989752,119.832522 39.978163,119.800009 39.977045,119.779168 39.953864,119.749679 39.952653,119.715909 39.941764,119.710464 39.9354,119.673882 39.936534,119.616414 39.910702,119.564879 39.907486,119.530626 39.886057,119.519661 39.848871,119.529785 39.825962,119.521555 39.814218,119.461217 39.811609,119.422995 39.790527,119.403799 39.785407,119.410992 39.779109,119.360283 39.74342,119.344657 39.720188,119.299806 39.610889,119.254963 39.518359,119.265487 39.490409,119.294832 39.460458,119.304738 39.432423,119.278771 39.422313,119.265356 39.422289,119.245853 39.432034,119.217943 39.454679,119.188943 39.456452,119.161939 39.470229,119.128479 39.461609,119.063702 39.475975,119.048055 39.461343,119.03813 39.459519,118.998835 39.466265,119.001552 39.475255,119.00954 39.480633,119.005887 39.504059,119.001248 39.508034,118.954887 39.51663,118.960982 39.52676,118.977074 39.531145,118.977338 39.537792,118.939372 39.543715,118.93828 39.557155,118.889345 39.545988,118.879355 39.551335,118.876233 39.565845,118.855477 39.573681,118.853252 39.585635,118.845464 39.589111,118.841489 39.605109,118.845635 39.623471,118.818808 39.648197,118.822011 39.651807,118.819096 39.661867,118.816274 39.667818,118.807534 39.669873,118.798143 39.678749,118.788944 39.696349,118.785584 39.715398,118.78055 39.714579,118.778318 39.720338,118.769659 39.76244,118.773142 39.766841,118.788117 39.769497,118.793971 39.772491,118.792914 39.789686,118.818645 39.795999,118.810431 39.806391,118.810283 39.821566,118.820677 39.835158,118.825628 39.858912,118.830487 39.864065,118.847647 39.880369,118.860226 39.929716,118.874666 39.93601,118.881879 39.950854,118.877489 40.006053,118.858017 40.029328,118.863675 40.047678,118.857315 40.05796,118.89978 40.088468,118.914995 40.09039,118.922309 40.099687,118.917339 40.111822,118.919415 40.123634,118.91459 40.126392,118.918723 40.148092,118.903102 40.157807,118.90736 40.163901,118.904083 40.168099,118.883735 40.166817,118.856853 40.180922,118.823392 40.17826,118.811611 40.191403,118.780487 40.210833,118.770611 40.19302,118.73746 40.190118,118.739971 40.206816,118.73375 40.211572,118.719947 40.212078,118.709967 40.217755,118.701508 40.214815,118.670459 40.233153,118.657083 40.246002,118.621695 40.251827,118.602864 40.253188,118.607531 40.261304,118.599562 40.266368,118.588271 40.268759,118.579893 40.26269,118.566839 40.266188,118.561579 40.283125,118.569071 40.291214,118.579156 40.288133,118.58023 40.292605,118.568927 40.295067,118.571795 40.307043,118.591115 40.307522,118.604281 40.318738,118.605963 40.328389,118.630807 40.347774,118.634156 40.361317,118.646426 40.369912,118.62369 40.394089,118.627944 40.413543,118.614098 40.414364,118.603256 40.427464,118.630027 40.448781,118.65745 40.44697,118.673615 40.473561,118.693652 40.490125,118.717377 40.472421,118.766814 40.478362,118.786013 40.491047,118.784264 40.494744,118.793681 40.515218,118.815264 40.530627,118.856845 40.526584,118.881505 40.541217,118.913412 40.529627,118.933496 40.532633,118.953014 40.530044,118.959969 40.535291,118.950573 40.555249,118.976905 40.564074,118.979504 40.571815,118.988988 40.576539,119.0048 40.576332,119.016525 40.58604,119.030211 40.588089,119.05653 40.604458,119.06442 40.603744,119.071406 40.589348,119.080853 40.587095,119.102418 40.601993,119.128527 40.60387,119.142868 40.612839,119.150567 40.612963,119.149559 40.60191))))",
//   })
//   .then((res) => {
//     debugger;
//     console.log(res);
//   });

// wfsHelperInstance.GetFeatureByPost({
//   // "workspace": "qhd",
//   // "workspaceUri": "http://qhd",
//   workspace: "hebeiqudiayuan",
//   workspaceUri: "http://hebeiqudiayuan",
//   "typename": "hebeiqudiayuan:旅游景区矢量更新",
//   "startIndex": 0,
//   "maxFeatures": 10,
//   "cql": "INTERSECTS (the_geom, MULTIPOLYGON(((116.613609 39.600193,116.621216 39.598537,116.630806 39.6035,116.646675 39.598209,116.659897 39.6035,116.704475 39.586063,116.719475 39.59119,116.718529 39.59594,116.694786 39.608475,116.693268 39.619297,116.719688 39.621721,116.73011 39.613602,116.741127 39.617969,116.755371 39.611511,116.766579 39.603916,116.771706 39.591381,116.782913 39.594227,116.783486 39.608093,116.804947 39.613979,116.806274 39.597458,116.800575 39.597835,116.801407 39.604343,116.793823 39.604977,116.790321 39.592331,116.800575 39.569729,116.789177 39.56517,116.78006 39.545986,116.787659 39.54314,116.798485 39.526424,116.813683 39.531742,116.818619 39.51009,116.806839 39.507812,116.812164 39.478184,116.779588 39.466656,116.777382 39.463345,116.788132 39.444061,116.799827 39.443428,116.811523 39.452599,116.821007 39.44817,116.819748 39.43679,116.825119 39.432995,116.845039 39.43837,116.865585 39.428253,116.829544 39.406124,116.826698 39.396008,116.833969 39.375141,116.811211 39.369766,116.814056 39.363762,116.828911 39.361866,116.821961 39.355541,116.815636 39.355541,116.821327 39.336575,116.84124 39.336887,116.848831 39.342895,116.851044 39.353962,116.86306 39.355225,116.868118 39.350166,116.862427 39.345108,116.864952 39.338787,116.882027 39.335625,116.882339 39.320133,116.879494 39.311913,116.874436 39.311283,116.875702 39.301167,116.859581 39.2999,116.854835 39.294842,116.856102 39.2901,116.865273 39.288521,116.869064 39.280933,116.87001 39.267654,116.864006 39.266705,116.869377 39.239201,116.884224 39.228474,116.884895 39.223473,116.876892 39.219135,116.868217 39.227139,116.865555 39.22414,116.868553 39.216137,116.848213 39.213467,116.849213 39.203133,116.856438 39.193077,116.859136 39.154457,116.862885 39.151112,116.886559 39.152779,116.9039 39.147442,116.917918 39.118325,116.911873 39.10611,116.903046 39.108635,116.87178 39.071822,116.862953 39.057026,116.829117 39.053249,116.810867 39.044231,116.806099 39.048965,116.777252 39.047268,116.787857 39.055119,116.779373 39.059998,116.767067 39.048119,116.749252 39.047695,116.744764 39.033533,116.751373 39.021175,116.747551 39.019054,116.745857 39.002083,116.733551 38.978748,116.720825 38.973232,116.706444 38.929893,116.701309 38.929535,116.700958 38.894592,116.713898 38.894592,116.715073 38.851884,116.737824 38.849289,116.73822 38.827717,116.742531 38.826542,116.733513 38.80085,116.738999 38.799671,116.735077 38.774963,116.740967 38.771038,116.737824 38.750839,116.749596 38.75182,116.759928 38.740513,116.760655 38.720162,116.756199 38.70838,116.748719 38.704076,116.739537 38.705342,116.738979 38.701706,116.751743 38.701687,116.762709 38.69216,116.758823 38.681862,116.762583 38.657223,116.771327 38.655324,116.772166 38.644541,116.754356 38.634294,116.732411 38.630664,116.735733 38.622266,116.727524 38.613144,116.709199 38.608656,116.696982 38.618444,116.679742 38.607774,116.67734 38.604491,116.682003 38.602274,116.67413 38.592104,116.662637 38.592158,116.656189 38.580993,116.662047 38.577832,116.668479 38.563278,116.63767 38.564225,116.635669 38.560947,116.638903 38.553023,116.668982 38.543141,116.653832 38.51799,116.641491 38.505938,116.62276 38.508812,116.62554 38.513186,116.619102 38.513756,116.609828 38.508458,116.608291 38.502577,116.621706 38.500544,116.606942 38.488246,116.612388 38.476746,116.59138 38.482113,116.591616 38.486526,116.58428 38.483429,116.585258 38.480364,116.575937 38.469795,116.56356 38.470552,116.555298 38.484453,116.560413 38.494059,116.542839 38.50269,116.535493 38.501554,116.527887 38.487981,116.500007 38.48665,116.459751 38.493779,116.443516 38.512766,116.45041 38.528358,116.442261 38.534108,116.427323 38.527848,116.42432 38.547341,116.436523 38.555376,116.449133 38.554894,116.442032 38.566902,116.448831 38.57949,116.419432 38.586132,116.414085 38.602414,116.385846 38.602058,116.35408 38.656185,116.36189 38.660802,116.355698 38.670839,116.357687 38.685774,116.387926 38.689396,116.38964 38.70227,116.421919 38.716054,116.425043 38.728644,116.4296 38.730604,116.430559 38.7533,116.417125 38.760484,116.418281 38.770957,116.410426 38.782836,116.373828 38.787198,116.377079 38.7989,116.36299 38.791641,116.355725 38.800638,116.337685 38.801023,116.336977 38.810368,116.331577 38.815751,116.314256 38.810204,116.266103 38.815834,116.267588 38.821023,116.277071 38.821665,116.270371 38.826319,116.272994 38.835523,116.243317 38.84509,116.242206 38.854005,116.226203 38.871058,116.214192 38.867296,116.202473 38.87434,116.194694 38.910774,116.202958 38.921004,116.226398 38.924562,116.226255 38.928392,116.221346 38.928853,116.222346 38.941437,116.229483 38.947763,116.237743 38.948508,116.239589 38.944678,116.239528 38.933,116.231261 38.930656,116.231377 38.92695,116.28134 38.945019,116.285505 38.947808,116.285269 38.964741,116.292493 38.974114,116.309434 38.961953,116.329264 38.983138,116.32558 38.986832,116.327788 38.989359,116.315816 38.997098,116.293646 38.99272,116.287827 39.006419,116.293771 39.01779,116.303095 39.015142,116.305177 39.02079,116.295677 39.021593,116.299993 39.030688,116.318452 39.031787,116.324805 39.038319,116.312573 39.03658,116.306118 39.070155,116.312355 39.07555,116.312682 39.081996,116.303157 39.084366,116.29486 39.103397,116.273583 39.1064,116.274171 39.115502,116.257003 39.11921,116.255806 39.13103,116.260113 39.132199,116.254114 39.13184,116.251324 39.138402,116.240733 39.142811,116.226345 39.144482,116.226362 39.148285,116.210944 39.147664,116.204594 39.165263,116.198089 39.167506,116.197876 39.184405,116.204108 39.205886,116.201303 39.209675,116.172276 39.214449,116.186187 39.224984,116.181646 39.234363,116.190051 39.261826,116.200927 39.26847,116.203779 39.278358,116.199517 39.279228,116.195374 39.302744,116.202401 39.322892,116.190625 39.354045,116.179733 39.356793,116.17525 39.350346,116.129341 39.353456,116.11114 39.365973,116.111517 39.37724,116.120689 39.384666,116.125803 39.398297,116.126352 39.429754,116.134335 39.429871,116.128913 39.43574,116.14541 39.469586,116.155576 39.471314,116.176385 39.49525,116.194797 39.501614,116.200069 39.509791,116.218252 39.507622,116.237986 39.51603,116.243736 39.504768,116.298714 39.482639,116.344795 39.448544,116.382111 39.453316,116.429603 39.443493,116.444145 39.44759,116.447013 39.452848,116.441177 39.476086,116.435829 39.479649,116.428711 39.480835,116.420395 39.474304,116.404366 39.48024,116.413277 39.49271,116.409119 39.50399,116.395462 39.512894,116.394279 39.526546,116.413864 39.523579,116.415649 39.514675,116.426331 39.505768,116.436424 39.508144,116.432274 39.522392,116.470856 39.533077,116.463738 39.553261,116.493416 39.547325,116.500542 39.549702,116.501137 39.5592,116.520134 39.572258,116.514313 39.584568,116.517372 39.59462,116.520729 39.597786,116.534378 39.59185,116.552788 39.598381,116.561691 39.609661,116.558724 39.618565,116.600052 39.623337,116.613609 39.600193)),((117.182335 40.081257,117.184135 40.070721,117.202087 40.080002,117.214111 40.063732,117.17627 40.060551,117.17379 40.05666,117.179802 40.023769,117.185814 40.019527,117.189354 39.990704,117.180512 39.976559,117.170258 39.975143,117.167778 39.957108,117.153984 39.96241,117.156776 39.951321,117.144821 39.946842,117.150353 39.94239,117.144333 39.928986,117.131523 39.921825,117.154068 39.90839,117.142906 39.897152,117.150864 39.891388,117.153793 39.87727,117.165619 39.879147,117.173119 39.869705,117.222656 39.857101,117.243866 39.862152,117.255562 39.851658,117.252045 39.834648,117.24861 39.834683,117.210205 39.8311,117.179428 39.81881,117.157349 39.824532,117.154245 39.818687,117.162758 39.798729,117.184441 39.783619,117.193405 39.771164,117.160942 39.733757,117.164009 39.676052,117.158898 39.640636,117.15242 39.626743,117.14695 39.625272,117.123245 39.621113,117.029236 39.653828,117.017502 39.654522,117.000481 39.645451,116.973511 39.642502,116.960411 39.650928,116.94426 39.682529,116.947899 39.710251,116.894295 39.696308,116.885475 39.720871,116.90654 39.741055,116.899635 39.755074,116.902069 39.75917,116.928085 39.771988,116.941383 39.768208,116.946205 39.772968,116.942055 39.792229,116.915399 39.846959,116.905548 39.848198,116.901245 39.837566,116.889122 39.836117,116.873741 39.848312,116.836906 39.861332,116.825226 39.87682,116.803215 39.876938,116.794525 39.878544,116.78022 39.892586,116.774513 39.94735,116.758469 39.959972,116.756104 39.966316,116.771263 40,116.755333 40.014852,116.751572 40.020969,116.760254 40.027573,116.797821 40.029987,116.834869 40.043587,116.865257 40.040291,116.95533 40.045658,116.961738 40.041401,116.962799 40.034008,116.978912 40.036648,116.991585 40.030045,117.016945 40.028194,117.01844 40.036003,117.029884 40.045891,117.045471 40.051437,117.044151 40.057777,117.062111 40.062004,117.061577 40.065437,117.076637 40.066494,117.07769 40.073097,117.095123 40.073624,117.098824 40.069134,117.111236 40.07019,117.131043 40.062004,117.14846 40.066841,117.148216 40.076267,117.165383 40.071247,117.177795 40.082603,117.182335 40.081257))))"
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
  备注: "呼高81米，档距575米",
});
feature.setId("jiquanxian_1045_2.353");
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
// wfsHelperInstance.Transaction({
//   type: "create",
//   featurePrefix: "qhd",
//   featureNS: "http://qhd",
//   featureType: "qhd:yh2",
//   srsName: 'EPSG:4326',
//   features: [feature as any],
// }).then(res => {
//   debugger
//   console.log(res)
// })

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

// restHelperInstance.getSystemStatus().then(res => {
//   debugger
//   console.log(res)
// })
// restHelperInstance.getVersion().then(res => {
//   debugger
//   console.log(res)
// })
// restHelperInstance.getFonts().then(res => {
//   debugger
//   console.log(res)
// })

// restHelperInstance.getLayerGroupListApi().then(res => {
//   debugger
//   console.log(res)
// })
// restHelperInstance.getLayerGroupInfoApi("tasmania").then(res => {
//   debugger
//   console.log(res)
// })

// Shapefile 类型
// restHelperInstance.addDatastoreApi({
//   name: "testAddDatastorehhh",
//   workspace: "ne",
//   description: "测试新增数据存储",
//   connectionParameters: {
//     entry: [{ "@key": "url", $: "file:data/水灾水面/水灾水面/20230731-1.shp" }],
//   },
// })
// .then((res) => {
//   console.log(res);
// });
// restHelperInstance.deleteDatastoreApi("ne", "testAddDatastorehhh").then((red) => {
//   console.log(red);
// })

// restHelperInstance.reload().then((res) => {
//   console.log(res);
//   console.log("重新加载成功");
// })
// restHelperInstance.getResourceDirectoryInfo("/styles").then((res) => {
//   console.log("资源目录加载成功");
// })


restHelperInstance.copyResource("/testData/dem.sld", "/styles/dem.sld").then((res) => {
  console.log("资源移动成功");
})

