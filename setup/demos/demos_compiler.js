
        window.demotools = {};
        window.demotools.html = "<div class=\"mambo-docs-container\">\n    <div class=\"angle angle-top-left\"></div>\n    <div class=\"angle angle-top-right\"></div>\n    <div class=\"angle angle-bottom-left\"></div>\n    <div class=\"angle angle-bottom-right\"></div>\n    <div class=\"bottom-tab\"></div>\n    <div class=\"right-tab\"></div>\n    <div class=\"close\"></div>\n\n    <div class=\"mambo-docs-content\">\n        <div id=\"sup\"></div>\n        <div id=\"docs\">\n            <div id=\"sidebar\">\n                <button class=\"mambo-btn transparent\">Que es Mambo UI?</button>\n                <button class=\"mambo-btn transparent\">Como lo uso?</button>\n                <button class=\"mambo-btn transparent\">DESCARGAR</button>\n            </div>\n            <div id=\"main\"></div>\n        </div>\n    </div>\n</div>";
        window.demotools.components = [{"alias":"api","component":"MamboAPIManager.js","custom":"demo-api","description":"","name":"MamboAPI","script":"// Container\nconst container = document.querySelector('demo-api');\n\ncontainer.innerHTML = 'soy API';\n\n\ntools.router.add([{ name: 'api2', path: '/demo/api/api2' }]);","code":null},{"alias":"date","component":"MamboDateManager.js","custom":"demo-date","description":"","name":"MamboDate","script":"// Container\nconst container = document.querySelector('demo-date');\n\ncontainer.innerHTML = 'soy DATE';","code":null},{"alias":"event","component":"MamboEventManager.js","custom":"demo-event","description":"","name":"MamboEvent","script":"// Container\nconst container = document.querySelector('demo-event');\n\ncontainer.innerHTML = 'soy EVENT';\n\nconsole.log('soy EVENT');","code":null},{"alias":"graphics","component":"MamboGraphics.js","custom":"demo-graphics","description":"","name":"MamboGraphics","script":"// Container\nconst container = document.querySelector('demo-graphics');\n\ncontainer.innerHTML = 'soy GRAPHICS';","code":null},{"alias":"history","component":"MamboHistoryManager.js","custom":"demo-history","description":"","name":"MamboHistory","script":"// Container\nconst container = document.querySelector('demo-history');\n\ncontainer.innerHTML = 'soy HISTORY';","code":null},{"alias":"object","component":"MamboObjectManager.js","custom":"demo-object","description":"","name":"MamboObject","script":"// Container\nconst container = document.querySelector('demo-object');\n\ncontainer.innerHTML = 'soy OBJECT';","code":null},{"alias":"router","component":"MamboRouterManager.js","custom":"demo-router","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","name":"MamboRouter","script":"//: Config and set Routes\n//@\nconst customRoutes = {\n    'Contactos': { name: 'Contactos', path: '/demo/mamborouter/contactos' }\n}\n\nconst Routes = [\n    customRoutes.Contactos\n]\n\ntools.router.routes(Routes)\n//! END\n    \n// Container\nconst container = document.querySelector('demo-router')\n\n// Dom Elements\nconst gotoBtn = document.createElement('button')\nconst backBtn = document.createElement('button')\n\ngotoBtn.innerText = 'Ir a contactos'\ngotoBtn.onclick = () => goTo(customRoutes.Contactos.path)\ncontainer.prepend(gotoBtn)\n\nbackBtn.innerText = '< Volver'\nbackBtn.onclick = () => tools.router.back()\ncontainer.prepend(backBtn)\n    \n//: Use Routes\n//@\nfunction goTo (path) {\n    tools.router.push({ path })\n}\n//! END","code":[{"comment":"Config and set Routes","script":"\nconst customRoutes = {\n    'Contactos': { name: 'Contactos', path: '/demo/mamborouter/contactos' }\n}\n\nconst Routes = [\n    customRoutes.Contactos\n]\n\ntools.router.routes(Routes)\n"},{"comment":"Use Routes","script":"\nfunction goTo (path) {\n    tools.router.push({ path })\n}\n"}]},{"alias":"string","component":"MamboString.js","custom":"demo-string","description":"","name":"MamboString","script":"// Container\nconst container = document.querySelector('demo-string');\n\ncontainer.innerHTML = 'soy STRING';","code":null},{"alias":"utils","component":"MamboUtilities.js","custom":"demo-utils","description":"","name":"MamboUtils","script":"// Container\nconst container = document.querySelector('demo-utils');\n\ncontainer.innerHTML = 'soy UTILS';","code":null}];
        