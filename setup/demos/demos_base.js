mambo.develop = true;

demotools.manager = new function demoManager () {

    const OUTPUT_PATH = '/demo';
    const AREAS = ['area', 'area-desc', 'area-code'];
    const TYPES = ['script', 'description', 'code'];

    const ROUTE = {
        name: 'ToolsHomeDemo',
        path: OUTPUT_PATH,
        action: () => {
            AREAS.forEach(area => {
                clearArea(area);
            });
        }
    }

    setup();

    function setup () {
        createHTMLbase();
        showComponentsList(demotools.components);
        addRoutes(demotools.components);
    }

    function addRoutes (components) {
        let routes = components.map(component => {
            return {
                name: component.name,
                path: `${OUTPUT_PATH}/${component.name.toLowerCase()}`,
                action: () => { runComponent(component); }
            }
        })

        routes.push(ROUTE);
    
        tools.router.routes(routes);
    }

    function applyCode (code, custom) {
        if (null !== code) {
            let area = document.getElementsByTagName(custom)[0];
            
            let printCodes = code.map(code => {
                return `<h4>${code.comment}</h4><pre>${code.script}</pre>`;
            })

            area.innerHTML = printCodes.join('');
        }
    }

    function applyDescription (desc, custom, name) {
        let area = document.getElementsByTagName(custom)[0];
        area.innerHTML = desc;
    }

    function applyScript (script, custom) {
        eval(script);
    }

    function clearArea (area) {
        let element = document.getElementById(area);
        element.innerHTML = '';
    }

    function createHTMLbase () {
        const html = eval('`' + demotools.html + '`');
        let parser = new DOMParser().parseFromString(html, 'text/html');
        document.querySelector('.web-content').prepend(parser.body.firstChild);

        createTabs('#main');
    }

    function createTabs (id) {
        let tabConfig = {
            parentTag: id,
            tabs: {
                buttons: [
                    {
                        text: "Que es Mambo UI?",
                        area: AREAS[1],
                        fnClick: (context) => {
                            // You can declare individual event handlers for tab clicks
                        }
                    }, {
                        text: "Como lo uso?",
                        area: AREAS[2]
                    }, {
                        text: "Demos",
                        area: AREAS[0]
                    }
                ],
                fnClick: (buttonContext) => {
                    // You can declare a single event handler for all tab clicks
                }
            },
            fnTabReady: (contentTag, tab) => {
                const content = dom.createTag("div", {
                    text: `This is content for Tab id: ${tab.id} name: ${tab.text}`,
                    attr: { id: tab.area }
                });
                contentTag.appendChild(content);
            }
        };

        new ui.tab(tabConfig);
    }

    function hidrateArea (object) {

        let area = document.getElementById(object.area);
        let customTag = document.createElement(object.id);

        clearArea(object.area);
        
        area.appendChild(customTag);

        switch (object.type) {
            case TYPES[0]:
                applyScript(object.component[object.type], object.id);
                break;
        
            case TYPES[1]:
                applyDescription(object.component[object.type], object.id, object.component.name);
                break;
            
            case TYPES[2]:
                applyCode(object.component[object.type], object.id);
                break;
        }
        
    }

    function runComponent (component){

        const options = [
            { area: AREAS[0], component, id: component.custom, type: TYPES[0] },
            { area: AREAS[1], component, id: `${component.custom}-desc`, type: TYPES[1] },
            { area: AREAS[2], component, id: `${component.custom}-code`, type: TYPES[2] }
        ]

        options.forEach(option => {
            hidrateArea(option);
        })
        
    }

    function showComponentsList (components) {
        let sidebar = document.getElementById('sidebar');
        let list = document.createElement('ul');

        components.forEach(component => {
            let item = document.createElement('li');
            item.innerText = component.name;
            item.onclick = () => { 
                tools.router.push({ path: `${OUTPUT_PATH}/${component.name.toLowerCase()}` });
            }
            list.appendChild(item);
        })

        sidebar.appendChild(list);
    }
}