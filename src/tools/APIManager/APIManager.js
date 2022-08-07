tools.class.APIManager = function APIManager(props) {
	let m_config;

	this.get = get;
	this.post = post;
	this.getFile = getFile;
	this.getJSON = fetchJSON;
	this.getText = fetchText;

	configure();

	async function getFile(path) {
		return await fetch(`getFile?path=${path}`).then((response) => response.text());
	}

	function fetchText(url) {
		return execRequest("GET", url);
	}

	function fetchJSON(url) {
		return execRequest("GET", url, { responseType: "json" });
	}

	function get(url, config) {
		return execRequest("GET", url, config);
	}

	function post(url, config) {
		return execRequest("POST", url, config);
	}

	function execRequest(method, url, config) {
		const xhrConfig = tools.utils.extend(true, m_config, config);

		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			addListeners(xhr);

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(xhr.response);
					} else {
						reject(xhr);
					}
				}
			};

			xhr.open(method, url);
			configureRequest(xhr, xhrConfig);
			xhr.send(processData(xhrConfig.data));
		});
	}

	function configureRequest(xhr, options) {
		if (options.contentType) {
			xhr.setRequestHeader("Content-type", options.contentType);
		}
		if (options.crossOrigin) {
			xhr.withCredentials = true;
		}
		xhr.responseType = options.responseType;
	}

	function processData(data) {
		if (data === null) {
			return null;
		}
		if (tools.utils.isObject(data)) {
			return getQueryString(data);
		} else {
			return data;
		}
	}

	/* function setQueryString(url, data) {
		let urlParts = url.split("?");
		let baseURL = urlParts[0];
		let params = urlParts.length > 1 ? "?" + urlParts[1] : "";
		let separator = urlParts.length > 1 ? "&" : "?";
		let queryString = processData(data);

		if (queryString !== null) {
			params += separator + queryString;
		}

		return baseURL + params;
	} */

	function addListeners(xhr) {
		// If not events, return
		if (!props || !props.events) {
			return;
		}

		let event = props.events.loadstart;
		if (event && typeof event === "function") {
			xhr.addEventListener("loadstart", event);
		}

		event = props.events.load;
		if (event && typeof event === "function") {
			xhr.addEventListener("load", event);
		}

		event = props.events.loadend;
		if (event && typeof event === "function") {
			xhr.addEventListener("loadend", event);
		}

		event = props.events.progress;
		if (event && typeof event === "function") {
			xhr.addEventListener("progress", event);
		}

		event = props.events.error;
		if (event && typeof event === "function") {
			xhr.addEventListener("error", event);
		}

		event = props.events.abort;
		if (event && typeof event === "function") {
			xhr.addEventListener("abort", event);
		}
	}

	function getQueryString(object) {
		let queryString = "";

		const keys = Object.keys(object);
		for (const key of keys) {
			let newParam = encodeURIComponent(key) + "=" + encodeURIComponent(object[key]);

			if (queryString === "") {
				queryString += newParam;
			} else {
				queryString += "&" + newParam;
			}
		}

		return queryString === "" ? null : queryString;
	}

	function configure() {
		m_config = {
			responseType: "",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			crossOrigin: false,
			data: null,
		};

		// If options provided, override default config
		if (props) {
			m_config = tools.utils.extend(true, m_config, props);
		}
	}
};

tools.api = (props) => new tools.class.APIManager(props);
