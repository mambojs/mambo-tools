/******************************************
 *  Copyright 2022 Alejandro Sebastian Scotti, Scotti Corp.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.

 *  Author : Alejandro Scotti
 *  Created On : Sat Feb 26 2022
 *  File : MamboUtilities.js
 *******************************************/
window['tools']['utils'] = new function MamboUtilities() {
    "use strict";

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
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
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
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    function isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    function isString(value) {
        return typeof value === 'string' || value instanceof String || Object.prototype.toString.call(value) === '[object String]';
    }

    function isNumber(value) {
        return typeof value === 'number' && value === value && value !== Infinity && value !== -Infinity;
    }

    function formatPercentage(number, decimals = 0) {
        if (!isNumber(number))
            return "";

        return (number * 100).toFixed(decimals) + "%";
    }
}
