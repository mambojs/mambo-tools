async function apiManager() {
	const dom = object.get("dom");
	const ui = object.get("ui");
	const container = dom.getTag("tab-demo");
	const apiMethods = ["deleteReq", "get", "getFile", "getFileContent", "getJSON", "getXML", "head", "patch", "post", "postJSON", "put"];
	let n = 0;
	let percentage = [];
	createNext(n);

	function createNext(n) {
		const method = apiMethods[n];

		ui.button({
			text: method,
			parentTag: container,
			fnClick: (context) => {
				const format = context.Button.dataset.format;
				const cached = context.Button.dataset.cache;
				eval(`${method}("${method}","${format}",${cached})`);
			},
			fnComplete: async (context) => {
				await installRadioGroupFormat(method, context);
				await installRadioGroupCache(method, context);
				await installPercentage(method);
				installPre(method);
				n++;
				if (n < apiMethods.length) {
					createNext(n);
				}
			},
		});

	}

	function installRadioGroupFormat(method, button) {
		const radios = {
			"deleteReq": [],
			"get": [],
			"getJSON": [
				{ text: "JSON", checked: true, value: null, position: "left" },
				{ text: "String", checked: false, value: "string", position: "left" },
				{ text: "Pretty", checked: false, value: "pretty", position: "left" },
			],
			"getFile": [
				{ text: "Show Image", checked: true, value: "show", position: "left" },
				{ text: "Download", checked: false, value: "download", position: "left" },
			],
			"getFileContent": [],
			"getXML": [
				{ text: "Text", checked: true, value: "text", position: "left" },
				{ text: "String", checked: false, value: "string", position: "left" },
				{ text: "XMLDocument", checked: false, value: "xml", position: "left" },
			],
			"head": [],
			"patch": [],
			"post": [],
			"postJSON": [
				{ text: "JSON", checked: true, value: null, position: "left" },
				{ text: "String", checked: false, value: "string", position: "left" },
				{ text: "Pretty", checked: false, value: "pretty", position: "left" },
			],
			"put": [],
		};

		return new Promise(resolve => {
			if (radios[method].length) {
				ui.radioGroup({
					parentTag: container,
					radios: radios[method],
					fnClick: (context) => {
						const selected = context.Radio.value();
						button.Button.dataset.format = selected;
					},
					fnComplete: () => resolve()
				});
			} else {
				resolve();
			}
		});
	}

	function installRadioGroupCache(method, button) {
		return new Promise(resolve => {
			if (method == "getFile" || method == "getFileContent" || method == "getJSON" || method == "getXML" || method == "postJSON") {
				ui.radioGroup({
					parentTag: container,
					radios: [
						{ text: "API Cache disabled", checked: true, value: undefined, position: "left" },
						{ text: "Cache On", checked: false, value: true, position: "left" },
						{ text: "Cache Off", checked: false, value: 'false', position: "left" },
					],
					fnClick: (context) => {
						const selected = context.Radio.value();
						button.Button.dataset.cache = selected;
					},
					fnComplete: () => resolve()
				});
			} else {
				resolve();
			}
		});
	}

	function installPercentage(method) {
		return new Promise(resolve => {
			percentage[method] = ui.percentage({
				parentTag: container,
				value: 0,
				fnComplete: () => resolve()
			});
		});
	}

	function installPre(method) {
		const pre = dom.createTag("pre");
		pre.id = method;
		container.append(pre);
	}


	// Init API
	const api = tools.api({
		timeout: 10000,
		cache: true,
	});

	// Delete
	async function deleteReq(method) {
		const pre = dom.getTag(`#${method}`);

		const headers = {
			"Authorization": "Bearer a8fe7e06db5831d2ca28995e966305c614cd54517288f91110ad59094c7f335a",
		}

		const response = await api.delete('https://gorest.co.in/public/v2/users/2486', { headers, events: (evts) => fnObserve(evts, "deleteReq") });

		if (response.ok) {
			pre.innerHTML = "Deleted!";
		} else {
			pre.innerHTML = JSON.stringify(await response.json(), null, 2);
		}
	}

	// Classic Get
	async function get(method) {
		const pre = dom.getTag(`#${method}`);
		const response = await api.get('https://reqres.in/api/users/2', { headers: { 'Accept': 'application/json'}, events: (evts) => fnObserve(evts, "get") } );
		pre.innerHTML = JSON.stringify(await response.json(), null, 2);
	}

	// Get JSON
	async function getJSON(method, format, cached) {
		const pre = dom.getTag(`#${method}`);
		const response = api.getJSON("https://reqres.in/api/users?page=2", { format, events: (evts) => fnObserve(evts, "getJSON"), cached });
		pre.innerHTML = await response + Math.random();
	}

	// Get File
	async function getFile(method, format, cached) {
		const pre = dom.getTag(`#${method}`);
		let response;

		try {
			response = await api.getFile("https://source.unsplash.com/random", { events: (evts) => fnObserve(evts, "getFile"), cached });
			const imgURL = URL.createObjectURL(response);

			if (format === "show") {
				const image = new Image();
				image.src = imgURL;
				image.style = "width:inherit;";
				pre.innerHTML = "";
				pre.appendChild(image);
			}

			if (format === "download") {
				const link = dom.createTag("a");
				link.download = "mambo-getFile.jpg";
				link.href = imgURL;
				link.click();
				link.remove();
			}

			console.log(api.getCache());
		} catch (error) {
			console.log(error)
		}

	}

	// Get File Content
	async function getFileContent(method, undefined, cached) {
		const pre = dom.getTag(`#${method}`);
		const response = await api.getFileContent("getFile?path=/src/tools/String/String.js", { events: (evts) => fnObserve(evts, "getFileContent"), cached });
		pre.innerHTML = response + Math.random();
	}

	// Get XML
	async function getXML(method, format, cached) {
		const pre = dom.getTag(`#${method}`);
		const response = api.getXML("http://api.nbp.pl/api/cenyzlota/", { format, events: (evts) => fnObserve(evts, "getXML"), cached });
		pre.innerHTML = await response + Math.random();
	}

	// Head
	async function head(method) {
		const pre = dom.getTag(`#${method}`);
		const response = await api.head('https://reqres.in/api/users/2', { events: (evts) => fnObserve(evts, "head") });
		let headers = [...response.headers ];
		pre.innerHTML = headers.toString();
	}

	// Patch
	async function patch(method) {
		const pre = dom.getTag(`#${method}`);

		const body = {
			"name": "Javier",
			"job": "Web Developer"
		}

		const response = await api.patch('https://reqres.in/api/users/2', { body, headers: { "Content-Type": "application/json" }, events: (evts) => fnObserve(evts, "patch") });
		pre.innerHTML = JSON.stringify(await response.json(), null, 2);
	}

	// Post
	async function post(method) {
		const pre = dom.getTag(`#${method}`);

		const body = {
			"name": "Javier B",
			"job": "web Developer"
		};

		const response = await api.post('https://reqres.in/api/users', { events: (evts) => fnObserve(evts, "post") });
		pre.innerHTML = JSON.stringify(await response.json(), null, 2);
	}

	// Post JSON
	async function postJSON(method, format, cached) {
		const pre = dom.getTag(`#${method}`);

		const body = {
			"name": "Javier",
			"job": "Developer"
		}
		// Formats string, pritty, (default object)
		const response = api.postJSON("https://reqres.in/api/users", { body, format, events: (evts) => fnObserve(evts, "postJSON"), cached });
		pre.innerHTML = await response + Math.random();

	}

	// Put
	async function put(method) {
		const pre = dom.getTag(`#${method}`);

		const body = {
			"name": "Javier Basualdo",
			"job": "Fullstack Developer"
		}
		const response = await api.put('https://reqres.in/api/users/2', { body, headers: { "Content-Type": "application/json" }, events: (evts) => fnObserve(evts, "put") });
		pre.innerHTML = JSON.stringify(await response.json(), null, 2);
	}

	// Observable
	function fnObserve(evts, method) {
		percentage[method].value({ value: 0 });
		const pre = dom.getTag(`#${method}`);
		pre.innerHTML = "";
		const image = new Image();
		image.style = "width:inherit;";
		pre.appendChild(image);

		evts.loadstart(status => {
			if (status) {
				console.log('Load Start');
			} else {
				console.log('Waiting Request');
			}
		});

		evts.load((loaded) => {
			if (loaded)
				console.log("Data Loaded");
		});

		evts.progress((prg) => {
			console.log(prg)
			percentage[method].value({ value: prg.percentage / 100 });

			if (prg.complete) {
				console.log('Progress finished');
			}

		});

		evts.error((error) => {
			console.log(`Process Error: ${error}`);
		})
	}

}
