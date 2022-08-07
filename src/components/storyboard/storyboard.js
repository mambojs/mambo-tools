function installStoryboard() {
	const router = object.get("router");
	const dom = object.get("dom");
	const ui = object.get("ui");

	const cevt = new CustomEvent("compiler-ready", {
		bubbles: true,
		cancelable: true,
		detail: {},
	});

	const storyboard = {};
	storyboard.html = "&nbsp;";
	storyboard.components = [];
	const demoFiles = [
		{ alias: "apiManager", name: "APIManager" },
		{ alias: "dateManager", name: "DateManager" },
		{ alias: "eventManager", name: "EventManager" },
		{ alias: "historyManager", name: "HistoryManager" },
		{ alias: "objectManager", name: "ObjectManager" },
		{ alias: "routerManager", name: "RouterManager" },
		{ alias: "string", name: "String" },
		{ alias: "utilities", name: "Utilities" },
	];

	const getModules = Promise.all(
		demoFiles.map(async ({ name, alias }) => {
			const demoContent = await getScript(`src/tools/${name}/storyboard/${alias}.js`);
			const mdContent = await getScript(`src/tools/${name}/storyboard/description.md`);
			storyboard.components.push({
				alias,
				code: demoContent.code,
				component: `${name}.js`,
				custom: `storyboard-${alias}`.toLocaleLowerCase(),
				description: mdContent.fullcontent,
				name,
				script: demoContent.fullcontent,
			});
		})
	);

	getModules.then(() => {
		storyboard.components.sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});

		getHtml();
	});

	async function getHtml() {
		const html = await getScript("src/components/storyboard/storyboard.html");
		storyboard.html = html.fullcontent;
		window.dispatchEvent(cevt);
	}

	async function getScript(path) {
		const file = await (await fetch(path)).text();

		const htmlEntities = (html) => {
			return html.replace(/[\u00A0-\u9999<>&]/g, function (i) {
				return "&#" + i.charCodeAt(0) + ";";
			});
		};

		const object = {
			content: "",
			fullcontent: file,
			code: null,
		};

		if (path.endsWith(".js")) {
			object.content = object.fullcontent.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "$1");

			const codeList = object.fullcontent.match(/\/\/:([\s\S]*?)\/\/!/gm);

			if (null !== codeList) {
				object.code = codeList.map((code) => {
					return {
						comment: htmlEntities(code.match(/(?<=\/\/:)(.*)/gm)[0].trim()),
						script: code.match(/(?<=\/\/@)([\s\S]*?)(?=\/\/!)/gm)[0],
					};
				});
			}
		}

		return object;
	}

	window.addEventListener("compiler-ready", storyboardManager);

	function storyboardManager() {
		const OUTPUT_PATH = "/";
		const AREAS = ["area", "area-desc", "area-code"];
		const TYPES = ["script", "description", "code"];

		const ROUTE = {
			name: "Storyboard",
			path: OUTPUT_PATH,
			action: () => {
				AREAS.forEach((area) => {
					clearArea(area);
				});
			},
		};

		setup();

		function setup() {
			createHTMLbase();
			showComponentsList(storyboard.components);
			addRoutes(storyboard.components);
		}

		function addRoutes(components) {
			let routes = components.map((component) => {
				return {
					name: component.name,
					path: `${OUTPUT_PATH}${component.name.toLowerCase()}`,
					action: () => {
						runComponent(component);
					},
				};
			});

			routes.push(ROUTE);

			router.routes(routes);
		}

		function applyCode(code, custom) {
			if (null !== code) {
				let printCodes = code.map((code) => {
					return `<h4>${code.comment}</h4><pre>${code.script}</pre>`;
				});

				dom.append(custom, printCodes.join(""));
			}
		}

		function applyDescription(desc, custom) {
			dom.append(custom, desc);
		}

		function applyScript(script) {
			eval(script);
		}

		function clearArea(area) {
			dom.empty(`#${area}`);
		}

		function createHTMLbase() {
			const html = eval("`" + storyboard.html + "`");
			let parser = new DOMParser().parseFromString(html, "text/html");
			dom.getTag("tools-storyboard").prepend(parser.body.firstChild);

			createTabs("#main");
		}

		function createTabs(id) {
			let tabConfig = {
				parentTag: id,
				tabs: {
					buttons: [
						{
							text: "Que es Mambo Tools?",
							area: AREAS[1],
							fnClick: () => {
								// You can declare individual event handlers for tab clicks
							},
						},
						{
							text: "Como lo uso?",
							area: AREAS[2],
						},
						{
							text: "Demos",
							area: AREAS[0],
						},
					],
					fnClick: () => {
						// You can declare a single event handler for all tab clicks
					},
				},
				fnTabReady: (contentTag, tab) => {
					const content = dom.createTag("div", {
						text: `This is content for Tab id: ${tab.id} name: ${tab.text}`,
						attr: { id: tab.area },
					});
					contentTag.appendChild(content);
				},
			};

			ui.tab(tabConfig);
		}

		function hidrateArea(object) {
			let area = dom.getTag(`#${object.area}`);
			let customTag = dom.createTag(object.id);

			clearArea(object.area);

			area.appendChild(customTag);

			switch (object.type) {
				case TYPES[0]:
					applyScript(object.component[object.type], object.id);
					break;

				case TYPES[1]:
					applyDescription(object.component[object.type], object.id, object.component.name);
					break;

				case TYPES[2]:
					applyCode(object.component[object.type], object.id);
					break;
			}
		}

		function runComponent(component) {
			const options = [
				{ area: AREAS[0], component, id: component.custom, type: TYPES[0] },
				{ area: AREAS[1], component, id: `${component.custom}-desc`, type: TYPES[1] },
				{ area: AREAS[2], component, id: `${component.custom}-code`, type: TYPES[2] },
			];

			options.forEach((option) => {
				hidrateArea(option);
			});
		}

		function showComponentsList(components) {
			let list = dom.createTag("ul");

			components.forEach((component) => {
				let item = dom.createTag("li");
				item.innerText = component.name;
				item.onclick = () => {
					router.push({ path: `${OUTPUT_PATH}${component.name.toLowerCase()}` });
				};
				list.appendChild(item);
			});

			dom.getTag("#sidebar").appendChild(list);
		}
	}
}
