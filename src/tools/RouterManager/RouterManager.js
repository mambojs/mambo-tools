tools.class.RouterManager = function RouterManager() {
	const self = this;
	window.addEventListener("locationchange", setRoute);

	let current = {
		name: "",
		path: "",
		from: {
			name: "",
			path: "",
		},
		to: {
			name: "",
			path: "",
		},
		params: {},
		query: "",
	};

	let historyManager;
	let routesList = [];

	this.add = addRoutes;
	this.back = routerBack;
	this.current = current;
	this.go = routerGo;
	this.hash = "";
	this.next = routerForward;
	this.push = routerPush;
	this.replace = routerReplace;
	this.routes = getSetRoutes;

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

					routesList.forEach((r) => {
						if (r.path === route.path || r.alias === route.path) {
							routeExist = true;
						}
					});

					if (!routeExist) {
						routesList.push(route);
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

	function getSetRoutes(args) {
		// Get

		if (!args) {
			return routesList;
		}

		// Set
		// Check objects format, Check duplicated name or path, Add routes to list, Init router/history

		if (routesList.length > 0) {
			addRoutes(args);
			return;
		}

		if (Array.isArray(args) && args.length) {
			if (!checkRoutesFormat(args)) {
				return;
			}

			if (!checkRoutesDuplicated(args)) {
				return;
			}

			routesList = args.concat(routesList);

			if (!historyManager) {
				const { matched, path } = matchedRouteBy({ path: location.pathname });

				if (matched) {
					historyManager = tools.history(path);
				}
            }

			return;
		}
	}

	function isCurrentRoute(routeObject) {
		if (routeObject.path === self.current.path) return true;
		return false;
	}

	function isValidRouteObject(args) {
		// Check if .rutes() is empty, Check if args is Object
		if (!routesList.length) return false;

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
		const routeMatched = routesList.find((route) => route.path === path || route.path + "/" === path || route.name === name);

		if (routeMatched) {
			return { matched: true, path: routeMatched.path };
		}

		if (path) {
			const hasAliases = routesList.find((route) => route.alias === path || route.alias === path + "/");

			if (hasAliases) {
				return { matched: true, path: hasAliases.alias };
			}
		}

		const hasNotFound = routesList.find((route) => route.notfound);

		if (hasNotFound) {
			return { matched: true, path: hasNotFound.path };
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

	function routerPush(routeObject) {
		if (isValidRouteObject(routeObject)) {
			if (isCurrentRoute(routeObject)) return;

			const { matched, path } = matchedRouteBy(routeObject);

			if (matched) {
				updateCurrent(routeObject, true);
				historyManager.pushState(path, "", path);
			}
		}
	}

	function routerReplace(args) {
		historyManager.replaceState(args, "", args.path);
	}

	function runAction() {
		if (Object.prototype.hasOwnProperty.call(self.current, "action")) {
			if (self.current.action.constructor.name === "Function") {
				self.current.action();
			}
		}
	}

	function setRoute() {
		const currentRouteObject = routesList.find((route) => route.path === history.state || route.alias === history.state);
		updateCurrent(currentRouteObject);
		runAction();
	}

	function updateCurrent(currentRouteObject, recicle) {
		if (recicle) {
			self.current = current;
		}

		self.current = tools.utils().extend(true, self.current, currentRouteObject);
	}
};

tools.router = (props) => new tools.class.RouterManager(props);
