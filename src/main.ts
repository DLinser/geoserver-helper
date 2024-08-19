import './style.css'
import typescriptLogo from './typescript.svg'
import geoserverRest from '../lib/main'
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
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
geoserverRest.utils.common.postXml(wpsurl, finishXmlString).then((res2) => {
  if (res2) {
    const jsonRes = JSON.parse(res2);
    debugger;
    console.log(jsonRes)
  }
});