function routerManager() {
	const router = object.get("router");
	const dom = object.get("dom");
	const ui = object.get("ui");

	//: Config and set Routes
	//@
	const customRoutes = {
		Contactos: { name: "Contactos", path: "/demo/mamborouter/contactos" },
	};

	const Routes = [customRoutes.Contactos];

	router.routes(Routes);
	//! END

	// Container
	const container = document.querySelector("tab-demo");

	// Dom Elements
	const gotoBtn = document.createElement("button");
	const backBtn = document.createElement("button");

	gotoBtn.innerText = "Ir a contactos";
	gotoBtn.onclick = () => goTo(customRoutes.Contactos.path);
	container.prepend(gotoBtn);

	backBtn.innerText = "< Volver";
	backBtn.onclick = () => router.back();
	container.prepend(backBtn);

	//: Use Routes
	//@
	function goTo(path) {
		router.push({ path });
	}
	//! END
}
