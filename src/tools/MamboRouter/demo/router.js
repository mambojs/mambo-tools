// Js Code
const customRoutes = {
    'Contactos': { name: 'Contactos', path: '/demo/mamborouter/contactos' }
}

const Routes = [
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

backBtn.innerText = '< Volver'
backBtn.onclick = () => tools.router.back()
container.prepend(backBtn)
    

function goTo (path) {
    tools.router.push({ path })
}