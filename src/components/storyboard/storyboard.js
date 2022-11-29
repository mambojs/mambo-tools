function installStoryboard() {
	const dom = object.get("dom");
	const ui = object.get("ui");
	const router = object.get("router");
	const storyParentTag = dom.getTag("storyboard-component");
	let stories;
	setup();

	function setup() {
		configureStoriesData();
		setRoutes();
		installComponentTreeView();
	}

	function configureStoriesData() {
		// Use alpha characters and spaces only, any other char will break
		stories = [
			{ text: "APIManager", fn: "apiManager" },
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

		router.routes(routes);
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
		storyParentTag.appendChild(selectedStory.parentTag);

		if (!itemData.page) {
			installTab(selectedStory);
		}
	}

	function installTab(props) {
		const storyFn = window[props.fn];
		const storyFnContent = storyFn.toString();

		let tabConfig = {
			parentTag: props.parentTag,
			tabs: {
				buttons: [
					{
						text: "Description",
						area: "tab-description",
						fnClick: (context) => {
							// You can declare individual event handlers for tab clicks
						},
					},
					{
						text: "Code",
						area: "tab-code",
					},
					{
						text: "Demo",
						area: "tab-demo",
					},
				],
				fnClick: (buttonContext) => {
					// You can declare a single event handler for all tab clicks
				},
			},
			fnTabComplete: async (contentTag, tab) => {
				const content = dom.createTag(tab.area);
				contentTag.appendChild(content);

				switch (tab.area) {
					case "tab-description": {
						const desc = await getDescription(props.text);
						dom.append(content, desc);
						break;
					}
					case "tab-code":
						dom.append(content, `<pre>${storyFnContent}</pre>`);
						break;
					case "tab-demo":
						storyFn(props);
						break;
				}
			},
		};

		ui.tab(tabConfig);
	}

	async function getDescription(story) {
		return await tools.api().getFileContent(`getFile?path=src/tools/${story}/storyboard/description.md`);
	}
}
