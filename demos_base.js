function showComponentsList (components) {
    let sidebar = document.getElementById('sidebar');
    let list = document.createElement('ul');

    components.forEach(component => {
        let item = document.createElement('li');
        item.innerText = component.name;
        item.onclick = () => runComponent(component);
        // item.onclick = () => tools.router.push({ path: `/demo/${component.name.toLowerCase()}` });
        list.appendChild(item);
    })

    sidebar.appendChild(list);
}
showComponentsList(demotools.components);

function runComponent (component) {
    let area = document.getElementById('area');
    let div = document.createElement('div');
    div.id = component.custom;

    clearArea();
    area.appendChild(div);
    applyScript(component.script, component.custom);
}

function applyScript (script, custom) {
    eval(script);
}

function clearArea () {
    let area = document.getElementById('area');
    area.innerHTML = '';
}

function addRoutes (components) {
    let routes = components.map(component => {
        return {
            name: component.name,
            path: `/demo/${component.name.toLowerCase()}`,
            // action: runComponent.bind(null, component)
        }
    })

    tools.router.routes(routes);
}
addRoutes(demotools.components);