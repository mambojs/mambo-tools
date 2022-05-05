window.demotools={},window.demotools.components=[{alias:"api",component:"MamboAPIManager.js",custom:"demo-api",description:"",name:"MamboAPI",script:"// Container\nconst container = document.getElementById('demo-api');\n\ncontainer.innerHTML = 'soy API';\n\n\ntools.router.add([{ name: 'api2', path: '/demo/api/api2' }]);",code:null},{alias:"date",component:"MamboDateManager.js",custom:"demo-date",description:"",name:"MamboDate",script:"// Container\nconst container = document.getElementById('demo-date');\n\ncontainer.innerHTML = 'soy DATE';",code:null},{alias:"event",component:"MamboEventManager.js",custom:"demo-event",description:"",name:"MamboEvent",script:"// Container\nconst container = document.getElementById('demo-event');\n\ncontainer.innerHTML = 'soy EVENT';\n\nconsole.log('soy EVENT');",code:null},{alias:"graphics",component:"MamboGraphics.js",custom:"demo-graphics",description:"",name:"MamboGraphics",script:"// Container\nconst container = document.getElementById('demo-graphics');\n\ncontainer.innerHTML = 'soy GRAPHICS';",code:null},{alias:"history",component:"MamboHistoryManager.js",custom:"demo-history",description:"",name:"MamboHistory",script:"// Container\nconst container = document.getElementById('demo-history');\n\ncontainer.innerHTML = 'soy HISTORY';",code:null},{alias:"object",component:"MamboObjectManager.js",custom:"demo-object",description:"",name:"MamboObject",script:"// Container\nconst container = document.getElementById('demo-object');\n\ncontainer.innerHTML = 'soy OBJECT';",code:null},{alias:"router",component:"MamboRouterManager.js",custom:"demo-router",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",name:"MamboRouter",script:"//: Config and set Routes\n//@\nconst customRoutes = {\n    'Contactos': { name: 'Contactos', path: '/demo/mamborouter/contactos' }\n}\n\nconst Routes = [\n    customRoutes.Contactos\n]\n\ntools.router.routes(Routes)\n//! END\n    \n// Container\nconst container = document.getElementById('demo-router')\n\n// Dom Elements\nconst gotoBtn = document.createElement('button')\nconst backBtn = document.createElement('button')\n\ngotoBtn.innerText = 'Ir a contactos'\ngotoBtn.onclick = () => goTo(customRoutes.Contactos.path)\ncontainer.prepend(gotoBtn)\n\nbackBtn.innerText = '< Volver'\nbackBtn.onclick = () => tools.router.back()\ncontainer.prepend(backBtn)\n    \n//: Use Routes\n//@\nfunction goTo (path) {\n    tools.router.push({ path })\n}\n//! END",code:[{comment:"Config and set Routes",script:"\nconst customRoutes = {\n    'Contactos': { name: 'Contactos', path: '/demo/mamborouter/contactos' }\n}\n\nconst Routes = [\n    customRoutes.Contactos\n]\n\ntools.router.routes(Routes)\n"},{comment:"Use Routes",script:"\nfunction goTo (path) {\n    tools.router.push({ path })\n}\n"}]},{alias:"string",component:"MamboString.js",custom:"demo-string",description:"",name:"MamboString",script:"// Container\nconst container = document.getElementById('demo-string');\n\ncontainer.innerHTML = 'soy STRING';",code:null},{alias:"utils",component:"MamboUtilities.js",custom:"demo-utils",description:"",name:"MamboUtils",script:"// Container\nconst container = document.getElementById('demo-utils');\n\ncontainer.innerHTML = 'soy UTILS';",code:null}],"localhost:8001"===location.host&&(new EventSource("http://localhost:8008").onmessage=()=>location.reload()),mambo.develop=!0;const OUTPUT_PATH="/demo",AREAS=["area","area-desc","area-code"],TYPES=["script","description","code"];window.demotools.manager={route:{name:"HomeDemo",path:OUTPUT_PATH,action:()=>{AREAS.forEach((e=>{demotools.manager.clearArea(e)}))}},createHTMLbase:function(){const e=`\n        <div id="app">\n            <div id="sidebar">\n                Lista de componentes\n            </div>\n            <div id="main">\n                <section>\n                    <h3>Descripcion</h3>\n                    <div id="${AREAS[1]}"></div>\n                </section>\n                <section>\n                    <h3>Demo</h3>\n                    <div id="${AREAS[0]}"></div>\n                    <h3>Codigo</h3>\n                    <div id="${AREAS[2]}"></div>\n                </section>\n            </div>\n        </div>\n        `;let o=(new DOMParser).parseFromString(e,"text/html");document.body.prepend(o.body.firstChild)},showComponentsList:e=>{let o=document.getElementById("sidebar"),n=document.createElement("ul");e.forEach((e=>{let o=document.createElement("li");o.innerText=e.name,o.onclick=()=>{tools.router.push({path:`${OUTPUT_PATH}/${e.name.toLowerCase()}`})},n.appendChild(o)})),o.appendChild(n)},runComponent:e=>{[{area:AREAS[0],component:e,id:e.custom,type:TYPES[0]},{area:AREAS[1],component:e,id:`${e.custom}-desc`,type:TYPES[1]},{area:AREAS[2],component:e,id:`${e.custom}-code`,type:TYPES[2]}].forEach((e=>{demotools.manager.hidrateArea(e)}))},hidrateArea:e=>{let o=document.getElementById(e.area),n=document.createElement("div");switch(n.id=e.id,demotools.manager.clearArea(e.area),o.appendChild(n),e.type){case TYPES[0]:demotools.manager.applyScript(e.component[e.type],e.id);break;case TYPES[1]:demotools.manager.applyDesc(e.component[e.type],e.id);break;case TYPES[2]:demotools.manager.applyCode(e.component[e.type],e.id)}},clearArea:e=>{document.getElementById(e).innerHTML=""},applyScript:(script,custom)=>{eval(script)},applyDesc:(e,o)=>{document.getElementById(o).innerHTML=e},applyCode:(e,o)=>{if(null!==e){let n=document.getElementById(o),t=e.map((e=>`<h4>${e.comment}</h4><pre>${e.script}</pre>`));n.innerHTML=t.join("")}},addRoutes:e=>{let o=e.map((e=>({name:e.name,path:`${OUTPUT_PATH}/${e.name.toLowerCase()}`,action:()=>{demotools.manager.runComponent(e)}})));o.push(demotools.manager.route),tools.router.routes(o)}},demotools.manager.createHTMLbase(),demotools.manager.showComponentsList(demotools.components),demotools.manager.addRoutes(demotools.components);
//# sourceMappingURL=index.js.map
