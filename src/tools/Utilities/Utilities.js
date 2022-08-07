tools.class.Utilities = function Utilities() {
	this.clone = clone;
	this.extend = extend;
	this.formatPercentage = formatPercentage;
	this.getUniqueId = getUniqueId;
	this.isArray = isArray;
	this.isNumber = isNumber;
	this.isObject = isObject;
	this.isString = isString;

	function extend() {
		// Variables
		let extended = {};
		let deep = false;
		let i = 0;
		let length = arguments.length;

		// Check if a deep merge
		if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		function merge(obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					// If deep merge and property is an object, merge properties
					if (deep && isObject(obj[prop])) {
						extended[prop] = extend(true, extended[prop], obj[prop]);
					} else if (deep && isArray(obj[prop])) {
						mergeArray(obj[prop], extended, prop);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		}

		function mergeArray(array, extended, prop) {
			extended[prop] = [];
			array.forEach((item, index) => {
				if (deep && isObject(item)) {
					extended[prop][index] = extend(true, extended[prop][index], item);
				} else if (deep && isArray(item)) {
					mergeArray(item, extended[prop], index);
				} else {
					extended[prop][index] = item;
				}
			});
		}

		// Loop through each object and conduct a merge
		for (; i < length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	}

	function getUniqueId(num) {
		num = num && !isNaN(num) ? num : 100000;
		return Math.floor(Math.random() * num);
	}

	function clone(object) {
		return extend(true, {}, object);
	}

	function isObject(value) {
		return Object.prototype.toString.call(value) === "[object Object]";
	}

	function isArray(value) {
		return Object.prototype.toString.call(value) === "[object Array]";
	}

	function isString(value) {
		return typeof value === "string" || value instanceof String || Object.prototype.toString.call(value) === "[object String]";
	}

	function isNumber(value) {
		return typeof value === "number" && value === value && value !== Infinity && value !== -Infinity;
	}

	function formatPercentage(number, decimals = 0) {
		if (!isNumber(number)) return "";

		return (number * 100).toFixed(decimals) + "%";
	}
};

tools.utils = (props) => new tools.class.Utilities(props);
