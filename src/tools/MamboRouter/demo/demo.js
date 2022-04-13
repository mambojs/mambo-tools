// Dom Elements
const gotoBtn = document.createElement('button')
const backBtn = document.createElement('button')

gotoBtn.innerText = 'Ir a contactos'
gotoBtn.onclick = () => goTo('/contactos')
document.body.prepend(gotoBtn)

backBtn.innerText = 'Volver'
backBtn.onclick = () => tools.router.back()
document.body.prepend(backBtn)

// Js Code
mambo.develop = true

const Routes = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'Contactos',
        path: '/contactos'
    }
]

tools.router.routes(Routes)

function goTo (path) {
    tools.router.push({ path })
}