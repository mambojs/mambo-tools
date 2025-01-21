async function apiManager() {
  const dom = object.get("dom");
  const ui = object.get("ui");
  const container = dom.getTag("tab-demo");
  const apiMethods = ["deleteReq", "get", "getFile", "getFileContent", "getJSON", "getXML", "head", "patch", "post", "postJSON", "put"];
  let n = 0;
  let percentage = [];
  createNext(n);
  function createNext(n) {
    const method = apiMethods[n];
    ui.button({
      text: method,
      parentTag: container,
      fnClick: (context) => {
        const format = context.Button.dataset.format;
        const cached = context.Button.dataset.cache;
        eval(`${method}("${method}","${format}",${cached})`);
      },
      fnComplete: async (context2) => {
        await installRadioGroupFormat(method, context2);
        await installRadioGroupCache(method, context2);
        await installPercentage(method);
        installPre(method);
        n++;
        if (n < apiMethods.length) {
          createNext(n);
        }
      }
    });
  }
  function installRadioGroupFormat(method2, button) {
    const radios = {
      "deleteReq": [],
      "get": [],
      "getJSON": [
        { text: "JSON", checked: true, value: null, position: "left" },
        { text: "String", checked: false, value: "string", position: "left" },
        { text: "Pretty", checked: false, value: "pretty", position: "left" }
      ],
      "getFile": [
        { text: "Show Image", checked: true, value: "show", position: "left" },
        { text: "Download", checked: false, value: "download", position: "left" }
      ],
      "getFileContent": [],
      "getXML": [
        { text: "Text", checked: true, value: "text", position: "left" },
        { text: "String", checked: false, value: "string", position: "left" },
        { text: "XMLDocument", checked: false, value: "xml", position: "left" }
      ],
      "head": [],
      "patch": [],
      "post": [],
      "postJSON": [
        { text: "JSON", checked: true, value: null, position: "left" },
        { text: "String", checked: false, value: "string", position: "left" },
        { text: "Pretty", checked: false, value: "pretty", position: "left" }
      ],
      "put": []
    };
    return new Promise((resolve) => {
      if (radios[method2].length) {
        ui.radioGroup({
          parentTag: container,
          radios: radios[method2],
          fnClick: (context2) => {
            const selected = context2.Radio.value();
            button.Button.dataset.format = selected;
          },
          fnComplete: () => resolve()
        });
      } else {
        resolve();
      }
    });
  }
  function installRadioGroupCache(method2, button) {
    return new Promise((resolve) => {
      if (method2 == "getFile" || method2 == "getFileContent" || method2 == "getJSON" || method2 == "getXML" || method2 == "postJSON") {
        ui.radioGroup({
          parentTag: container,
          radios: [
            { text: "API Cache disabled", checked: true, value: void 0, position: "left" },
            { text: "Cache On", checked: false, value: true, position: "left" },
            { text: "Cache Off", checked: false, value: "false", position: "left" }
          ],
          fnClick: (context2) => {
            const selected = context2.Radio.value();
            button.Button.dataset.cache = selected;
          },
          fnComplete: () => resolve()
        });
      } else {
        resolve();
      }
    });
  }
  function installPercentage(method2) {
    return new Promise((resolve) => {
      percentage[method2] = ui.percentage({
        parentTag: container,
        value: 0,
        fnComplete: () => resolve()
      });
    });
  }
  function installPre(method2) {
    const pre = dom.createTag("pre");
    pre.id = method2;
    container.append(pre);
  }
  const api = tools.api({
    timeout: 1e4,
    cache: true
  });
  async function deleteReq(method2) {
    const pre = dom.getTag(`#${method2}`);
    const headers = {
      "Authorization": "Bearer a8fe7e06db5831d2ca28995e966305c614cd54517288f91110ad59094c7f335a"
    };
    const response = await api.delete("https://gorest.co.in/public/v2/users/2486", { headers, events: (evts) => fnObserve(evts, "deleteReq") });
    if (response.ok) {
      pre.innerHTML = "Deleted!";
    } else {
      pre.innerHTML = JSON.stringify(await response.json(), null, 2);
    }
  }
  async function get(method2) {
    const pre = dom.getTag(`#${method2}`);
    const response = await api.get("https://reqres.in/api/users/2", { headers: { "Accept": "application/json" }, events: (evts) => fnObserve(evts, "get") });
    pre.innerHTML = JSON.stringify(await response.json(), null, 2);
  }
  async function getJSON(method2, format2, cached2) {
    const pre = dom.getTag(`#${method2}`);
    const response = api.getJSON("https://reqres.in/api/users?page=2", { format: format2, events: (evts) => fnObserve(evts, "getJSON"), cached: cached2 });
    pre.innerHTML = await response + Math.random();
  }
  async function getFile(method2, format2, cached2) {
    const pre = dom.getTag(`#${method2}`);
    let response;
    try {
      response = await api.getFile("https://source.unsplash.com/random", { events: (evts) => fnObserve(evts, "getFile"), cached: cached2 });
      const imgURL = URL.createObjectURL(response);
      if (format2 === "show") {
        const image = new Image();
        image.src = imgURL;
        image.style = "width:inherit;";
        pre.innerHTML = "";
        pre.appendChild(image);
      }
      if (format2 === "download") {
        const link = dom.createTag("a");
        link.download = "mambo-getFile.jpg";
        link.href = imgURL;
        link.click();
        link.remove();
      }
      console.log(api.getCache());
    } catch (error) {
      console.log(error);
    }
  }
  async function getFileContent(method2, undefined2, cached2) {
    const pre = dom.getTag(`#${method2}`);
    const response = await api.getFileContent("getFile?path=/src/tools/String/String.js", { events: (evts) => fnObserve(evts, "getFileContent"), cached: cached2 });
    pre.innerHTML = response + Math.random();
  }
  async function getXML(method2, format2, cached2) {
    const pre = dom.getTag(`#${method2}`);
    const response = api.getXML("http://api.nbp.pl/api/cenyzlota/", { format: format2, events: (evts) => fnObserve(evts, "getXML"), cached: cached2 });
    pre.innerHTML = await response + Math.random();
  }
  async function head(method2) {
    const pre = dom.getTag(`#${method2}`);
    const response = await api.head("https://reqres.in/api/users/2", { events: (evts) => fnObserve(evts, "head") });
    let headers = [...response.headers];
    pre.innerHTML = headers.toString();
  }
  async function patch(method2) {
    const pre = dom.getTag(`#${method2}`);
    const body = {
      "name": "Javier",
      "job": "Web Developer"
    };
    const response = await api.patch("https://reqres.in/api/users/2", { body, headers: { "Content-Type": "application/json" }, events: (evts) => fnObserve(evts, "patch") });
    pre.innerHTML = JSON.stringify(await response.json(), null, 2);
  }
  async function post(method2) {
    const pre = dom.getTag(`#${method2}`);
    const body = {
      "name": "Javier B",
      "job": "web Developer"
    };
    const response = await api.post("https://reqres.in/api/users", { events: (evts) => fnObserve(evts, "post") });
    pre.innerHTML = JSON.stringify(await response.json(), null, 2);
  }
  async function postJSON(method2, format2, cached2) {
    const pre = dom.getTag(`#${method2}`);
    const body = {
      "name": "Javier",
      "job": "Developer"
    };
    const response = api.postJSON("https://reqres.in/api/users", { body, format: format2, events: (evts) => fnObserve(evts, "postJSON"), cached: cached2 });
    pre.innerHTML = await response + Math.random();
  }
  async function put(method2) {
    const pre = dom.getTag(`#${method2}`);
    const body = {
      "name": "Javier Basualdo",
      "job": "Fullstack Developer"
    };
    const response = await api.put("https://reqres.in/api/users/2", { body, headers: { "Content-Type": "application/json" }, events: (evts) => fnObserve(evts, "put") });
    pre.innerHTML = JSON.stringify(await response.json(), null, 2);
  }
  function fnObserve(evts, method2) {
    percentage[method2].value({ value: 0 });
    const pre = dom.getTag(`#${method2}`);
    pre.innerHTML = "";
    const image = new Image();
    image.style = "width:inherit;";
    pre.appendChild(image);
    evts.loadstart((status) => {
      if (status) {
        console.log("Load Start");
      } else {
        console.log("Waiting Request");
      }
    });
    evts.load((loaded) => {
      if (loaded)
        console.log("Data Loaded");
    });
    evts.progress((prg) => {
      console.log(prg);
      percentage[method2].value({ value: prg.percentage / 100 });
      if (prg.complete) {
        console.log("Progress finished");
      }
    });
    evts.error((error) => {
      console.log(`Process Error: ${error}`);
    });
  }
}
function dateManager() {
  const container2 = document.querySelector("tab-demo");
  container2.innerHTML = "soy Date Manager";
}
function eventManager() {
  const container2 = document.querySelector("tab-demo");
  container2.innerHTML = "soy Event Manager";
}
function historyManager() {
  const container2 = document.querySelector("tab-demo");
  container2.innerHTML = "soy History Manager";
}
function ipfs() {
}
function objectManager() {
  const container2 = document.querySelector("tab-demo");
  container2.innerHTML = "soy Object Manager";
}
function routerManager() {
  const router = object.get("router");
  const dom2 = object.get("dom");
  const ui2 = object.get("ui");
  const customRoutes = {
    Contactos: { name: "Contactos", path: "/demo/mamborouter/contactos" }
  };
  const Routes = [customRoutes.Contactos];
  router.routes(Routes);
  //! END
  const container2 = document.querySelector("tab-demo");
  const gotoBtn = document.createElement("button");
  const backBtn = document.createElement("button");
  gotoBtn.innerText = "Ir a contactos";
  gotoBtn.onclick = () => goTo(customRoutes.Contactos.path);
  container2.prepend(gotoBtn);
  backBtn.innerText = "< Volver";
  backBtn.onclick = () => router.back();
  container2.prepend(backBtn);
  function goTo(path) {
    router.push({ path });
  }
  //! END
}
function string() {
  const container2 = document.querySelector("tab-demo");
  container2.innerHTML = "soy String";
}
function utilities() {
  const container2 = document.querySelector("tab-demo");
  container2.innerHTML = "soy Utils";
}
