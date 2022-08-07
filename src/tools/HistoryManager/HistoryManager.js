tools.class.HistoryManager = function HistoryManager() {
	const popstate = new Event("popstate");
	const locationchange = new Event("locationchange");

	let path;

	// Public methods
	this.back = backState;
	this.clearState = clearState;
	this.forward = forwardState;
	this.go = goToState;
	this.pushState = pushState;
	this.replaceState = replaceState;
	this.setPath = setPath;

	setupEventHandler();
	checkHistory();

	function setPath(newPath) {
		path = newPath;
	}

	function pushState(state, title, path) {
		setPageTitle(title);
		history.pushState(state, title, path);
		window.dispatchEvent(popstate);
	}

	function clearState(state, title) {
		setPageTitle(title);
		history.replaceState({ path: "/" }, title, "/");
		window.dispatchEvent(popstate);
	}

	function replaceState(state, title, path) {
		setPageTitle(title);
		history.replaceState(state, title, path);
		window.dispatchEvent(popstate);
	}

	function goToState(args) {
		history.go(args);
	}

	function backState() {
		history.back();
	}

	function forwardState() {
		history.forward();
	}

	function setPageTitle(title) {
		const titleTag = document.querySelector("title");
		if (title && titleTag) {
			titleTag.innerText = title;
		}
	}

	function setupEventHandler() {
		window.addEventListener("popstate", () => {
			window.dispatchEvent(locationchange);
		});
	}

	function checkHistory() {
		if (history.state === null) {
			replaceState(path, "", path);
		} else {
			window.dispatchEvent(locationchange);
		}
	}
};

tools.history = (props) => new tools.class.HistoryManager(props);
