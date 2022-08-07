function eventManager() {
	const router = object.get("router");
	const dom = object.get("dom");
	const ui = object.get("ui");
	const container = document.querySelector("demo-event");

	container.innerHTML = "soy EVENT";

	console.log("soy EVENT");
}
