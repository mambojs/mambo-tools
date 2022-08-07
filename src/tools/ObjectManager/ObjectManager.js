tools.class.ObjectManager = function ObjectManager() {
	// Object library
	let store = {};

	this.get = (name) => store[name];
	this.save = saveObject;
	this.remove = (name) => delete store[name];
	this.getLibrary = () => store;
	this.clearLibrary = () => (store = {});

	function saveObject(object, name) {
		const objName = name ? name : object.constructor.name;
		store[objName] = object;
	}
};

tools.object = (props) => new tools.class.ObjectManager(props);
