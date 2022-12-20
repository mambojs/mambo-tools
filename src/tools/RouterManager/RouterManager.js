tools.class.RouterManager = function RouterManager(props) {
	const self = this;
	window.addEventListener("locationchange", setRoute);

	let m_props;
	let current = {
		name: "",
		path: "",
		from: {},
		to: {},
		params: {},
		query: "",
	};

	let historyManager;
	let m_routesList = [];
	let m_eventListener;
	let m_routerEvents = [{ name: "onBeforeRouteUpdate", used: false }];
	let m_lastRoute = {};
	let m_newMatchedObject;

	this.add = addRoutes;
	this.back = routerBack;
	this.current = current;
	this.go = routerGo;
	this.hash = "";
	this.next = routerForward;
	this.push = routerPush;
	this.replace = routerReplace;
	this.routes = getSetRoutes;
	this.init = init;

	setup();

	function setup() {
		config(props);
		prepareEvents();
		getSetRoutes(m_props.routes);
	}

	function init() {
		if (!historyManager) {
			self.current.path = location.pathname;
			const { matched, path, newMatchedObject, originalObject } = matchedRouteBy({ path: location.pathname });
			setRouteTo(originalObject);

			if (path !== "/") {
				updateCurrent(newMatchedObject);
			}

			historyManager = tools.history(path);

			if (path === "/") {
				execDispatch("onBeforeRouteUpdate", self.current, newMatchedObject, path);
			}
		}
	}

	function addRoutes(args) {
		if (args.constructor.name === "Array" && args.length) {

			if (!checkRoutesFormat(args)) {
				return;
			}

			if (!checkRoutesDuplicated(args)) {
				return;
			}

			args.forEach((route) => {
				if (route.constructor.name === "Object") {
					let routeExist = false;

					m_routesList.forEach((r) => {
						if (r.path === route.path || r.alias === route.path) {
							routeExist = true;
						}
					});

					if (!routeExist) {
						m_routesList.push(route);
					}
				}
			});
		}
	}

	function checkRoutesDuplicated(args) {
		const uniqueByName = [...new Map(args.map((item) => [item["name"], item])).values()];
		const uniqueByPath = [...new Map(args.map((item) => [item["path"], item])).values()];

		if (uniqueByName.length < args.length || uniqueByPath.length < args.length) {
			return false;
		}

		return true;
	}

	function checkRoutesFormat(args) {
		const isValidFormat = args.every(
			(obj) => obj.constructor.name === "Object" && "path" in obj && typeof obj.path === "string" && obj.path.trim() !== ""
		);

		if (!isValidFormat) {
			return false;
		}

		return true;
	}

	function checkBasePath(path) {
		if (m_props.basePath.length) {
			let newPaths = [];

			m_props.basePath.forEach((base) => {
				if (base.charAt() !== "/") {
					base = base.replace(/^/, "/");
				}

				newPaths.push(`${base}${path}`);
			});

			if (!m_props.baseStrict) {
				newPaths.push(path);
			}

			return newPaths;
		} else {
			return path;
		}
	}

	function getSetRoutes(args) {
		// Get

		if (!args) {
			return m_routesList;
		}

		// Set
		// Check objects format, Check duplicated name or path, Add routes to list, Init router/history

		if (m_routesList.length > 0) {
			addRoutes(args);
			return;
		}

		if (Array.isArray(args) && args.length) {
			addRoutes(args);
			return;
		}
	}

	function isCurrentRoute(routeObject) {
		if (routeObject.path === self.current.path) return true;
		return false;
	}

	function isValidRouteObject(args) {
		// Check if .rutes() is empty, Check if args is Object
		if (!m_routesList.length) return false;

		if (args && args.constructor.name === "Object") {
			// Allow path/name/params/query/hash, Only strings & object values

			const allowedKeysList = [
				{ name: "path", type: "String" },
				{ name: "name", type: "String" },
				{ name: "params", type: "Object" },
				{ name: "query", type: "String" },
				{ name: "hash", type: "String" },
			];

			let wrongKeysValues = [];

			const isAllKeysValid = Object.entries(args).every((arr) => {
				let allowed = allowedKeysList.filter((obj) => obj.name === arr[0] && obj.type === arr[1].constructor.name);

				if (!allowed.length) {
					wrongKeysValues.push(arr);
				}

				return allowed.length > 0;
			});

			if (isAllKeysValid) return true;

			return false;
		}

		return false;
	}

	function matchedRouteBy({ path, name }) {

		if (m_props.basePath.length && name) {
			console.error("When basePath is true, {name} param not run. Please, change BaseStrict to false or send {path} param");
			return { matched: false };
		}

		const originalMatched = m_routesList.find((route) => {
			return (
				route.path === path ||
				route.path + "/" === path ||
				route.alias === path ||
				route.alias === path + "/" ||
				route.name === name
			);
		});

		const routeMatched = m_routesList.find((route) => {
			return checkBasePath(route.path).includes(path) || checkBasePath(route.path + "/").includes(path) || route.name === name;
		});

		if (routeMatched) {
			path = path || routeMatched.path;
			return { matched: true, path, newMatchedObject: updatePath(routeMatched, path), originalObject: originalMatched || {} };
		}

		if (path) {
			const hasAliases = m_routesList.find((route) => {
				if (route.alias) {
					return checkBasePath(route.alias).includes(path) || checkBasePath(route.alias).includes(path + "/");
				}
			});

			if (hasAliases) {
				return { matched: true, path, newMatchedObject: updatePath(hasAliases, path), originalObject: originalMatched || {} };
			}
		}

		const hasNotFound = m_routesList.find((route) => route.notfound);

		if (hasNotFound) {
			return { matched: true, path, newMatchedObject: updatePath(hasNotFound, path), originalObject: originalMatched || {} };
		}

		return { matched: false };
	}

	function routerBack() {
		historyManager.back();
	}

	function routerForward() {
		historyManager.forward();
	}

	function routerGo(args) {
		if (!Number.isInteger(args)) return;
		historyManager.go(args);
	}

	function routerPush(routeObject, dispatch = true) {
		if (isValidRouteObject(routeObject)) {
			if (isCurrentRoute(routeObject)) return;
			const { matched, path, newMatchedObject, originalObject } = matchedRouteBy(routeObject);

			if (matched) {
				setRouteFrom();
				setRouteTo(originalObject);

				if (dispatch) {
					execDispatch("onBeforeRouteUpdate", self.current, newMatchedObject, path);
				} else {
					goToNewRoute(newMatchedObject, path);
				}
			}
		}
	}

	function routerReplace(args) {
		historyManager.replaceState(args, "", args.path);
	}

	function runAction() {
		if (Object.prototype.hasOwnProperty.call(self.current, "action")) {
			if (self.current.action.constructor.name === "Function") {
				self.current.action(self);
			}
		}
	}

	function goToNewRoute(newRouteObject, path) {
		updateCurrent(newRouteObject);
		historyManager.pushState(path, "", path);
	}

	function setRoute() {
		setLastRoute();
		runAction();
	}

	function updateCurrent(currentRouteObject, recicle) {
		if (recicle) {
			self.current = current;
		}

		self.current = tools.utils().extend(true, self.current, currentRouteObject);
	}

	function updatePath(routeObject, path) {
		return tools.utils().extend(true, routeObject, { path });
	}

	function prepareEvents(options) {
		m_eventListener = document.createElement("div");

		let eventObject = {};

		m_routerEvents.forEach((event) => {
			eventObject[event.name] = (cbk) => {
				event.used = true;
				addListeners(event.name, (res) => cbk(res.to, res.from, next));
			};
		});

		m_props.events(eventObject);
	}

	function addListeners(event, cbk) {
		m_eventListener.addEventListener(event, (x) => cbk(x.detail));
	}

	function execDispatch(event, currentObject, newMatchedObject, path) {
		m_newMatchedObject = newMatchedObject;
		const evtObject = m_routerEvents.find((evt) => evt.name === event);

		if (evtObject.used) {
			m_eventListener.dispatchEvent(new CustomEvent(event, { detail: currentObject }));
		} else {
			setRouteTo({});
			goToNewRoute(m_newMatchedObject, path);
		}
	}

	function setLastRoute() {
		const simpleRoute = tools.utils().extend(true, {}, self.current);
		delete simpleRoute.from;
		delete simpleRoute.to;
		m_lastRoute = tools.utils().extend(true, m_lastRoute, simpleRoute);
	}

	function setRouteFrom(routeObject) {
		self.current.from = m_lastRoute;
	}

	function setRouteTo(originalObject) {
		self.current.to = originalObject;
	}

	function next(params) {
		if (params) {
			self.push(params, false);
			return;
		}

		let path = self.current.to.path;
		setRouteFrom();
		setRouteTo({});
		goToNewRoute(m_newMatchedObject, path);
	}

	function config(props = {}) {
		m_props = {
			basePath: [],
			baseStrict: false,
		};

		m_props = tools.utils().extend(true, m_props, props);
	}
};

tools.router = (props) => new tools.class.RouterManager(props);
