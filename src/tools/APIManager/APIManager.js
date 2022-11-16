tools.class.APIManager = function APIManager(props) {
	let m_config;
	let m_eventListener;
	let m_cached = {};

	this.delete = deleteMethod;
	this.get = getMethod;
	this.getCache = getCache;
	this.getFile = getFile;
	this.getFileContent = getFileContent;
	this.getJSON = getJSON;
	this.getXML = getXML;
	this.head = headMethod;
	this.patch = patchMethod;
	this.post = postMethod;
	this.postJSON = postJSON;
	this.put = putMethod;

	configure();

	async function deleteMethod(url, custom) {
		let options = {
			method: "DELETE",
		};

		delete custom?.method;
		options = tools.utils().extend(true, options, custom);
		return processResponse(await execRequest(url, options), { response: true });
	}

	async function getMethod(url, custom) {
		let options = {
			url,
		};

		delete custom?.method;
		options = tools.utils().extend(true, options, custom);
		return processResponse(await execRequest(url, options), { response: true });

	}

	async function getFile(url, custom) {
		let options = {
			// mode: 'no-cors',
		}

		delete custom?.method;
		delete custom?.response;
		options = tools.utils().extend(true, options, custom);
		const key = cacheKey(url, options);
		return processResponse(await execRequest(url, options, key), { ...custom, url }, "blob", key);
	}

	async function getFileContent(url, custom) {
		let options = {};
		delete custom?.method;
		delete custom?.response;
		options = tools.utils().extend(true, options, custom);
		const key = cacheKey(url, options);
		return processResponse(await execRequest(url, options, key), { ...custom, url }, "text", key);
	}

	async function getJSON(url, custom) {

		let options = {
			headers: {
				'Accept': 'application/json',
			},
		}

		delete custom?.method;
		delete custom?.headers?.["Accept"];
		delete custom?.response;
		options = tools.utils().extend(true, options, custom);
		const key = cacheKey(url, options);
		return processResponse(await execRequest(url, options, key), { ...custom, url }, "json", key);

	}

	async function getXML(url, custom) {

		let options = {
			headers: {
				'Accept': 'application/xml',
			},
		}

		delete custom?.method;
		delete custom?.headers?.["Accept"];
		delete custom?.response;
		options = tools.utils().extend(true, options, custom);
		const key = cacheKey(url, options);
		// Response Format options [String,Text,XMLDocument];
		return processResponse(await execRequest(url, options, key), { ...custom, url }, "xml", key);
	}

	async function headMethod(url, custom) {
		let options = {
			method: "HEAD",
		};

		delete custom?.method;
		options = tools.utils().extend(true, options, custom);
		return processResponse(await execRequest(url, options), { response: true });
	}

	async function patchMethod(url, custom) {
		let options = {
			method: "PATCH",
		};

		if (tools.utils().isObject(custom?.body)) {
			custom.body = JSON.stringify(custom.body);
		}

		delete custom?.method;
		options = tools.utils().extend(true, options, custom);
		return processResponse(await execRequest(url, options), { response: true });
	}

	async function postMethod(url, custom) {
		let options = {
			method: "POST",
		}

		if (tools.utils().isObject(custom?.body)) {
			custom.body = JSON.stringify(custom.body);
		}

		delete custom?.method;
		options = tools.utils().extend(true, options, custom);
		return processResponse(await execRequest(url, options), { response: true });
	}

	async function postJSON(url, custom) {

		let options = {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
		}

		if (tools.utils().isObject(custom?.body)) {
			custom.body = JSON.stringify(custom.body);
		}

		delete custom?.method;
		delete custom?.headers?.["Accept"];
		delete custom?.headers?.["Content-Type"];
		delete custom?.response;

		options = tools.utils().extend(true, options, custom);
		const key = cacheKey(url, options);
		return processResponse(await execRequest(url, options, key), { ...custom, url }, "json", key);
	}

	async function putMethod(url, custom) {
		let options = {
			method: "PUT",
		};

		if (tools.utils().isObject(custom?.body)) {
			custom.body = JSON.stringify(custom.body);
		}

		delete custom?.method;
		options = tools.utils().extend(true, options, custom);
		return processResponse(await execRequest(url, options), { response: true });
	}

	async function processResponse(response, custom, type, cacheKey) {

		let cloned;
		let finalResponse;

		if (response) {
			cloned = response.clone();
		}

		progressProcess(response, custom.url, cacheKey).catch(error => execDispatch("api_error", error));

		if (isCached(custom.url, cacheKey)) {
			return cacheResponse(custom.url, cacheKey);
		}

		if (custom?.response) {
			return cloned;
		}

		if (type === "json") {
			finalResponse = response.ok ? setJSONFormat(custom?.format, cloned) : {};
			cacheSave(custom, cacheKey, finalResponse);
			return finalResponse;
		}

		if (type === "blob") {
			finalResponse = response.ok ? cloned.blob() : {};
			cacheSave(custom, cacheKey, finalResponse);
			return finalResponse;
		}

		if (type === "text") {
			finalResponse = response.ok ? cloned.text() : {};
			cacheSave(custom, cacheKey, finalResponse);
			return finalResponse;
		}

		if (type === "xml") {
			finalResponse = response.ok
				? setXMLFormat(custom?.format, cloned)
				: new DOMParser().parseFromString("", "text/xml");
			cacheSave(custom, cacheKey, finalResponse);
			return finalResponse;
		}

	}

	async function execRequest(url, options, key) {

		let config = {
			url,
			options: {
				method: "GET",
				signal: AbortSignal.timeout(m_config.timeout),
			}
		}

		delete options?.signal;
		config = tools.utils().extend(true, config, { options });
		prepareEvents(options);
		checkIfCachedOff(options.cached, url);

		if (key && isCached(url, key)) {
			return;
		}

		try {
			return await processHandler(config);
		} catch (error) {
			return errorHandler(error);
		}

	}

	async function processHandler({ url, options }) {

		execDispatch("api_loadstart", true);
		const request = await fetch(url, options);
		const handleError = await errorHandler(request);

		if (handleError) {
			return handleError;
		} else {
			return request;
		}

	}

	function errorHandler(error) {

		return new Promise((resolve, reject) => {

			if (error.name) {
				const customOptions = {
					statusText: error.message,
					ok: false,
					status: 404,
				}
				resolve(new Response('Error', customOptions));
			}

			if (!error.ok) {
				resolve(error);
			} else {
				resolve(false);
			}

		});

	}

	async function setXMLFormat(format, response) {

		if (format === "string") {
			const text = await response.text();

			return text.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
				return '&#'+i.charCodeAt(0)+';';
			});
		}

		if (format === "xml") {
			return new DOMParser().parseFromString(await response.text(), "text/xml");
		}

		return response.text();

	}

	async function setJSONFormat(format, response) {

		if (format === "string") {
			return JSON.stringify(await response.json());
		}

		if (format === "pretty") {
			return JSON.stringify(await response.json(), null, 2);
		}

		return response.json();
	}

	async function progressProcess(response, url, cacheKey) {

		let cancel = false;

		let detail = {
			loaded: 0,
			total: 0,
			percentage: 100,
			complete: true,
			content: null,
			cancel: () => {
				m_eventListener.remove();
				cancel = true;
			},
		};

		if (isCached(url, cacheKey)) {
			execDispatch("api_progress", detail);
			execDispatch("api_load", true);
			return;
		}

		const reader = response.body.getReader();
		let contentLength = response.headers.get('Content-Length') || 0;
		let receivedLength = 0;
		let chunks = [];

		while(true) {
			let {done, value} = await reader.read();

			if (done || cancel) {
				detail.complete = done;
				execDispatch("api_progress", detail);
				execDispatch("api_load", true);
				m_eventListener.remove();
				break;
			}

			chunks.push(value);
			receivedLength += value.length;
			if (contentLength === 0) contentLength = receivedLength;
			detail.loaded = receivedLength;
			detail.total = contentLength;
			detail.percentage = receivedLength / contentLength * 100;
			detail.complete = done;
			detail.content = chunks;
			execDispatch("api_progress", detail);
		}
	}

	function prepareEvents(options) {
		m_eventListener = document.createElement("div");
		if(options?.events) options.events(getEvents());
		execDispatch("api_loadstart", false);
		execDispatch("api_load", false);
	}

	function getEvents() {
		const apiEvents = ["api_error", "api_load", "api_loadstart", "api_progress"];
		let eventObject = {};

		apiEvents.forEach(event => {
			let eventName = event.split("_")[1];
			eventObject[eventName] = (cbk) => {
				addListeners(event, (res) => cbk(res));
			}
		});

		return eventObject;
	}

	function addListeners(event, cbk) {
		m_eventListener.addEventListener(event, (x) => cbk(x.detail));
	}

	function execDispatch(event, props) {
		m_eventListener.dispatchEvent(new CustomEvent(event, { detail: props }));
	}

	function cacheKey(url, options) {
		return btoa(url + JSON.stringify(options));
	}

	function cacheSave(custom, cacheKey, finalResponse) {
		if ((m_config.cache && custom.cached !== false) || custom.cached === true) {
			if (!m_cached[custom.url]) {
				m_cached[custom.url] = {};
			}
			m_cached[custom.url][cacheKey] = finalResponse;
		}
	}

	function isCached(url, cacheKey) {
		if (m_cached[url] && m_cached[url][cacheKey]) {
			return true;
		}
		return false;
	}

	function checkIfCachedOff(cached, url) {
		if (cached === false && m_cached[url]) {
			delete m_cached[url];
		}
	}

	function cacheResponse(url, key) {
		return m_cached[url][key];
	}

	function getCache() {
		return m_cached;
	}

	function configure() {
		m_config = {
			timeout: 5000,
		};

		// If options provided, override default config
		if (props) {
			m_config = tools.utils().extend(true, m_config, props);
		}
	}
};

tools.api = (props) => new tools.class.APIManager(props);
