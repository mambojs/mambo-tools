// Js Code
mambo.develop = true

const customRoutes = {
    'Home': { name: 'Home', path: '/' },
    'HomeDemo': { name: 'Demo Home', path: '/demo/mamborouter' },
    'Contactos': { name: 'Contactos', path: '/demo/mamborouter/contactos' }
}

const Routes = [
    customRoutes.Home,
    customRoutes.HomeDemo,
    customRoutes.Contactos
]

tools.router.routes(Routes)
    
// Container
const container = document.getElementById('demo-router')

// Dom Elements
const gotoBtn = document.createElement('button')
const backBtn = document.createElement('button')

gotoBtn.innerText = 'Ir a contactos'
gotoBtn.onclick = () => goTo(customRoutes.Contactos.path)
container.prepend(gotoBtn)

backBtn.innerText = 'Demo Home'
backBtn.onclick = () => tools.router.back()
container.prepend(backBtn)
    

function goTo (path) {
    tools.router.push({ path })
}