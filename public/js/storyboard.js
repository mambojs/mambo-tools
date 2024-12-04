function installStoryboard() {
	const dom = object.get("dom");
	const ui = object.get("ui");
	const router = object.get("router");
	const storyParentTag = dom.getTag("story-tab");
	let stories;
	let documentations = {};
	setup();

	function setup() {
		configureStoriesData();
		setRoutes();
		installComponentTreeView();
		setupHomeButton();
		loadDocumentation().then()
			.catch((error) => {
				console.error("Failed to load documentation:", error);
			});
	}

	function configureStoriesData() {
		// Use alpha characters and spaces only, any other char will break
		stories = [
			{ text: "APIManager", fn: "ApiManager" },
			{ text: "DateManager", fn: "dateManager" },
			{ text: "EventManager", fn: "eventManager" },
			{ text: "HistoryManager", fn: "historyManager" },
			{ text: "ObjectManager", fn: "objectManager" },
			{ text: "RouterManager", fn: "routerManager" },
			{ text: "String", fn: "string" },
			{ text: "Utilities", fn: "utilities" },
		];

		// Add props to stories collection
		stories.map((story) => {
			story.id = story.text.replaceAll(" ", "-").toLowerCase();
			story.parentTag = dom.createTag(`story-${story.id}`);
		});
	}

	function setRoutes() {

		let routes = [
			{
				name: "Home",
				path: "/",
				action: () => showPageContent("Home")
			},
			{
				name: "404",
				path: "/404",
				notfound: true,
				action: () => showPageContent("Not Found"),
			}
		];

		stories.forEach(story => {
			routes.push(
				{
					name: story.text,
					path: `/${story.fn.toLowerCase()}`,
					action: () => {
						loadComponent(story);
					}
				}
			);
		});

		router.routes({ historyManager: object.get("history"), routes: routes });
		router.add(routes);
	}

	function showPageContent(page) {
		const tag = dom.createTag(`story-${page.replace(" ", "-").toLowerCase()}`);
		storyParentTag.innerHTML = null;
		storyParentTag.appendChild(dom.createTag("h4", { text: page }));
		storyParentTag.appendChild(tag);
	}

	function installComponentTreeView() {
		const treeViewConfig = {
			parentTag: "storyboard-treeview",
			data: [
				{
					text: "Tools Components",
					items: stories,
				},
			],
			expanded: true,
			fnSelect: goTo,
		};

		ui.treeView(treeViewConfig);
	}

	function goTo({ itemData }) {
		router.push({ path: `/${itemData.id}` });
	}

	function loadComponent(itemData) {
		if (!itemData.id) {
			// User clicked the main Tree
			return;
		}

		const selectedStory = stories.find((story) => story.id === itemData.id);
		selectedStory.parentTag.innerHTML = null;
		storyParentTag.innerHTML = null;
		storyParentTag.appendChild(dom.createTag("h4", { text: selectedStory.text }));

		if (!itemData.page) {
			installTab(selectedStory);
		}
	}

	function installTab(props) {
		const storyFn = window[props.fn];
		const storyFnContent = storyFn.toString();

		let tabConfig = {
			parentTag: storyParentTag,
			tabs: {
				buttons: [
					{
						text: "Demo",
						area: "tab-demo",
					},
					{
						text: "Code",
						area: "tab-code",
						class: {class: "code-container"}
					},
					{
						text: "Documentation",
						area: "tab-documentation",
						class: { class: "documentation-container" },
						fnClick: (context) => {
							// You can declare individual event handlers for tab clicks
						},
					},
				],
				fnClick: (buttonContext) => {
					// You can declare a single event handler for all tab clicks
				},
			},
			fnTabComplete: async (contentTag, tab) => {
				const content = dom.createTag(tab.area, tab.class);
				contentTag.appendChild(content);

				switch (tab.area) {
					case "tab-documentation":
						outputDocumentation(props.text);
						break;
					case "tab-code":
						outputCode(storyFnContent, content);
						break;
					case "tab-demo":
						storyFn(props);
						break;
				}},

		};

		ui.tab(tabConfig);
	}

	async function loadDocumentation() {
		const file = await fetch("getFile?type=documentation");
		const text = await file.text();
		const documentationElement = dom.createTag("documentation-element");
		documentationElement.innerHTML = addIdsToHeadings(marked.parse(text));
		storyParentTag.appendChild(documentationElement);
	}

	function slugify(text) {
		return text
			.toString()
			.toLowerCase()
			.trim()
			.replace(/[\s]+/g, " ")
			.replace(/[^\w-]+/g, "");
	}

	function addIdsToHeadings(htmlContent) {
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = htmlContent;
		const headings = tempDiv.querySelectorAll("h2");
		documentations = {};

		headings.forEach((heading, index) => {
			const headingId = slugify(heading.textContent);
			heading.setAttribute("id", headingId);

			let sectionContent = `<h2 id="${headingId}">${heading.textContent}</h2>`;
			let nextElement = heading.nextElementSibling;
			while (nextElement && nextElement.tagName !== "H2") {
				sectionContent += nextElement.outerHTML;
				nextElement = nextElement.nextElementSibling;
			}

			documentations[headingId] = sectionContent;
		});

		return tempDiv.innerHTML;
	}

	function setupHomeButton() {
		const homeButton = dom.getTag("#homeButton");
		homeButton.setup({
			id: "homeButton",
			text: "Home",
			fnClick: () => {
				storyParentTag.innerHTML = null;
				loadDocumentation().then().catch((error) => {
					console.error("Failed to load documentation:", error);
				});
			},
		});
	}

	function outputCode(code, parentTag) {
		const codeElement = dom.createTag("pre", { class: "prettyprint lang-basic", text: code });
		parentTag.appendChild(codeElement);
		PR.prettyPrint();
	}

	function outputDocumentation(storyName) {
		const sectionId = slugify(storyName);
		const documentationContainer = dom.getTag("tab-documentation");
		if (documentations[sectionId]) {
			documentationContainer.innerHTML = documentations[sectionId];
		}
	}
}
