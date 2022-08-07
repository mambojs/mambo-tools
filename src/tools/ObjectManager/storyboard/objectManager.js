function objectManager() {
	const router = object.get("router");
	const dom = object.get("dom");
	const ui = object.get("ui");
	const container = document.querySelector("demo-object");

	container.innerHTML = "soy OBJECT";
}
