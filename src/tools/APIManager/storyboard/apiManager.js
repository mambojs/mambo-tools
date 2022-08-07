function apiManager() {
	const router = object.get("router");
	const dom = object.get("dom");
	//const ui = object.get("ui");

	const container = dom.getTag("demo-api");

	container.innerHTML = "soy API";

	router.add([{ name: "api2", path: "/demo/api/api2" }]);
}
