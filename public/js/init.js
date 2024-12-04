// Main Object where Mambo Tools is Built
const tools = { class: {} };

const toolsComponents = [
	{ name: "APIManager", fn: "ApiManager" },
	{ name: "DateManager", fn: "dateManager" },
	{ name: "EventManager", fn: "eventManager" },
	{ name: "HistoryManager", fn: "historyManager" },
	{ name: "ObjectManager", fn: "objectManager" },
	{ name: "RouterManager", fn: "routerManager" },
	{ name: "String", fn: "string" },
	{ name: "Utilities", fn: "utilities" },
];

async function loadScripts() {
	await Promise.all(
		toolsComponents.map(async (component) => {
			try {
				const [scriptResponse, storyResponse] = await Promise.all([
					fetch(`/getFile?type=script&name=${component.name}`),
					fetch(`/getFile?type=story&name=${component.name}`),
				]);

				const scriptContent = await scriptResponse.text();
				const storyContent = await storyResponse.text();

				const scriptFunction = new Function("tools", scriptContent);
				scriptFunction(tools);

				const functionName = `${component.fn}`;
				window[functionName] = new Function(`return ${storyContent}`)();
			} catch (error) {
				console.error(`Error loading script for ${component}:`, error);
			}
		})
	);
}
