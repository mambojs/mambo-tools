mambo.develop = true

window.demotools.manager = {
    route: {
        name: 'HomeDemo',
        path: '/demo',
        // alias: '/'
    },
    showComponentsList: (components) => {
        let sidebar = document.getElementById('sidebar');
        let list = document.createElement('ul');

        components.forEach(component => {
            let item = document.createElement('li');
            item.innerText = component.name;
            item.onclick = () => { 
                tools.router.push({ path: `/demo/${component.name.toLowerCase()}` });
            }
            list.appendChild(item);
        })

        sidebar.appendChild(list);
    },
    runComponent: (component) => {
        let area = document.getElementById('area');
        let div = document.createElement('div');
        div.id = component.custom;

        demotools.manager.clearArea();
        area.appendChild(div);
        demotools.manager.applyScript(component.script, component.custom);
    },
    clearArea: () => {
        let area = document.getElementById('area');
        area.innerHTML = '';
    },
    applyScript: (script, custom) => {
        eval(script);
    },
    addRoutes: (components) => {
        let routes = components.map(component => {
            return {
                name: component.name,
                path: `/demo/${component.name.toLowerCase()}`,
                action: () => { demotools.manager.runComponent(component); }
            }
        })

        routes.push(demotools.manager.route);
    
        tools.router.routes(routes);
    }
}

demotools.manager.showComponentsList(demotools.components);

demotools.manager.addRoutes(demotools.components);