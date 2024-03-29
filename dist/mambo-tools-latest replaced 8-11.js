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

*  @author Alejandro Sebastian Scotti
*  @version latest
*******************************************/

function mamboTools() { 
const tools = {};
tools.api = function MamboAPIManager(options) {
  "use strict";
  let m_config;
  this.get = get;
  this.post = post;
  this.getFile = getFile;
  this.getJSON = fetchJSON;
  this.getText = fetchText;
  configure();
  async function getFile(path) {
    return await fetch(`http://localhost:8000/getFile?path=${path}`).then((response) => response.text());
  }
  function fetchFile(filePath) {
    const url = "http://localhost:8000/getFile?";
    const options2 = {
      data: {
        path: filePath
      }
    };
    return execRequest("GET", url, options2);
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
    const xhrConfig = mambo.utils.extend(true, m_config, config);
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      addListeners(xhr);
      xhr.onreadystatechange = function(aEvt) {
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
  function configureRequest(xhr, options2) {
    if (options2.contentType) {
      xhr.setRequestHeader("Content-type", options2.contentType);
    }
    if (options2.crossOrigin) {
      xhr.withCredentials = true;
    }
    xhr.responseType = options2.responseType;
  }
  function processData(data) {
    if (data === null) {
      return null;
    }
    if (mambo.utils.isObject(data)) {
      return getQueryString(data);
    } else {
      return data;
    }
  }
  function setQueryString(url, data) {
    let urlParts = url.split("?");
    let baseURL = urlParts[0];
    let params = urlParts.length > 1 ? "?" + urlParts[1] : "";
    let separator = urlParts.length > 1 ? "&" : "?";
    let queryString = processData(data);
    if (queryString !== null) {
      params += separator + queryString;
    }
    return baseURL + params;
  }
  function addListeners(xhr) {
    if (!options || !options.events) {
      return;
    }
    let event = options.events.loadstart;
    if (event && typeof event === "function") {
      xhr.addEventListener("loadstart", event);
    }
    event = options.events.load;
    if (event && typeof event === "function") {
      xhr.addEventListener("load", event);
    }
    event = options.events.loadend;
    if (event && typeof event === "function") {
      xhr.addEventListener("loadend", event);
    }
    event = options.events.progress;
    if (event && typeof event === "function") {
      xhr.addEventListener("progress", event);
    }
    event = options.events.error;
    if (event && typeof event === "function") {
      xhr.addEventListener("error", event);
    }
    event = options.events.abort;
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
      data: null
    };
    if (options) {
      m_config = mambo.utils.extend(true, m_config, options);
    }
  }
};
tools.date = function MamboDateManager() {
  "use strict";
  const self = this;
  const m_formatTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  this.add = add;
  this.cloneDate = cloneDate;
  this.createDate = createDate;
  this.createInterval = createInterval;
  this.endOf = endOf;
  this.format = format;
  this.getDate = getDate;
  this.getDayName = getDayName;
  this.getToday = getToday;
  this.isAfter = isAfter;
  this.isSameOrAfter = isSameOrAfter;
  this.isBefore = isBefore;
  this.isSame = isSame;
  this.isSameOrBefore = isSameOrBefore;
  this.isDate = isDate;
  this.startOf = startOf;
  function getToday() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
  function format(date, formatText) {
    if (!isDate(date) || !isString(formatText)) {
      return "";
    }
    let tokens = formatText.match(m_formatTokens);
    let returnValue = "";
    tokens.forEach((token) => {
      let text = "";
      switch (token) {
        case "H":
          text = getHours(date, false);
          break;
        case "HH":
          text = addZero(getHours(date, false), 2);
          break;
        case "h":
          text = getHours(date, true);
          break;
        case "hh":
          text = addZero(getHours(date, true), 2);
          break;
        case "m":
          text = date.getMinutes();
          break;
        case "mm":
          text = addZero(date.getMinutes(), 2);
          break;
        case "a":
          text = getAMPM(date);
          break;
        case "A":
          text = getAMPM(date).toUpperCase();
          break;
        case "D":
          text = date.getDate();
          break;
        case "DD":
          text = addZero(date.getDate(), 2);
          break;
        case "ddd":
          text = getDayName(date.getDay()).substring(0, 3);
          break;
        case "dddd":
          text = getDayName(date.getDay());
          break;
        case "M":
          text = date.getMonth() + 1;
          break;
        case "MM":
          text = addZero(date.getMonth() + 1, 2);
          break;
        case "MMM":
          text = getMonthName(date.getMonth()).substring(0, 3);
          break;
        case "MMMM":
          text = getMonthName(date.getMonth());
          break;
        case "YY":
          text = date.getFullYear().toString().slice(-2);
          break;
        case "YYYY":
          text = date.getFullYear();
          break;
        default:
          text = token;
      }
      returnValue += text;
    });
    return returnValue;
  }
  function createDate(text, formatText) {
    if (!isString(text) || !isString(formatText)) {
      return null;
    }
    let index = 0;
    let values = { "y": 0, "M": 0, "d": 1, "h": 0, "m": 0, "s": 0, "ms": 0 };
    let tokens = formatText.match(m_formatTokens);
    let toSlice = 0;
    let value = text;
    for (let i = 0, len = tokens.length; i < len; i++) {
      let token = tokens[i];
      switch (token) {
        case "H":
          if (/^(1\d|2[0-3])$/g.test(value.substring(0, 2))) {
            toSlice = 2;
          } else if (/^(\d)$/g.test(value.substring(0, 1))) {
            toSlice = 1;
          } else {
            return null;
          }
          values["h"] = parseInt(value.substring(0, toSlice));
          break;
        case "HH":
          if (/^([0-1]\d|2[0-3])$/g.test(value.substring(0, 2))) {
            toSlice = 2;
          } else {
            return null;
          }
          values["h"] = parseInt(value.substring(0, toSlice));
          break;
        case "h":
          if (/^(1[0-2])$/g.test(value.substring(0, 2))) {
            toSlice = 2;
          } else if (/^(\d)$/g.test(value.substring(0, 1))) {
            toSlice = 1;
          } else {
            return null;
          }
          values["h"] = parseInt(value.substring(0, toSlice));
          break;
        case "hh":
          if (/^([0]\d|1[0-2])$/g.test(value.substring(0, 2))) {
            toSlice = 2;
          } else {
            return null;
          }
          values["h"] = parseInt(value.substring(0, toSlice));
          break;
        case "m":
          if (/^([1-5]\d)$/g.test(value.substring(0, 2))) {
            toSlice = 2;
          } else if (/^(\d)$/g.test(value.substring(0, 1))) {
            toSlice = 1;
          } else {
            return null;
          }
          values["m"] = parseInt(value.substring(0, toSlice));
          break;
        case "mm":
          if (/^([0-5]\d)$/g.test(value.substring(0, 2))) {
            toSlice = 2;
          } else {
            return null;
          }
          values["m"] = parseInt(value.substring(0, toSlice));
          break;
        case "a":
        case "A":
          if (/^(am)$/ig.test(value.substring(0, 2))) {
            toSlice = 2;
            values["h"] = values["h"] === 12 ? 0 : values["h"];
          } else if (/^(pm)$/ig.test(value.substring(0, 2))) {
            toSlice = 2;
            values["h"] = values["h"] < 12 ? values["h"] + 12 : values["h"];
          } else {
            toSlice = 0;
          }
          break;
        case "D":
          if (/^([1-2]\d|3[0-1])$/g.test(value.substring(0, 2))) {
            toSlice = 2;
          } else if (/^([1-9])$/g.test(value.substring(0, 1))) {
            toSlice = 1;
          } else {
            return null;
          }
          values["d"] = parseInt(value.substring(0, toSlice));
          break;
        case "DD":
          if (/^(0[1-9]|[1-2]\d|3[0-1])$/g.test(value.substring(0, 2))) {
            toSlice = 2;
          } else {
            return null;
          }
          values["d"] = parseInt(value.substring(0, toSlice));
          break;
        case "M":
          if (/^(1[0-2])$/g.test(value.substring(0, 2))) {
            toSlice = 2;
          } else if (/^([1-9])$/g.test(value.substring(0, 1))) {
            toSlice = 1;
          } else {
            return null;
          }
          values["M"] = parseInt(value.substring(0, toSlice)) - 1;
          break;
        case "MM":
          if (/^(0[1-9]|1[0-2])$/g.test(value.substring(0, 2))) {
            toSlice = 2;
          } else {
            return null;
          }
          values["M"] = parseInt(value.substring(0, toSlice)) - 1;
          break;
        case "MMM":
          index = monthNames.findIndex((name) => name.toUpperCase() === value.substring(0, 3).toUpperCase());
          if (index < 0) {
            return null;
          }
          toSlice = 3;
          values["M"] = index;
          break;
        case "MMMM":
          index = monthNames.findIndex((name) => name.toUpperCase() === value.substring(0, name.length).toUpperCase());
          if (index < 0) {
            return null;
          }
          toSlice = monthNames[index].length;
          values["M"] = index;
          break;
        case "YY":
          if (/^(\d{2})$/g.test(value.substring(0, 2))) {
            toSlice = 2;
          } else {
            return null;
          }
          values["y"] = parseInt(value.substring(0, toSlice));
          break;
        case "YYYY":
          if (/^(\d{4})$/g.test(value.substring(0, 4))) {
            toSlice = 4;
          } else {
            return null;
          }
          values["y"] = parseInt(value.substring(0, toSlice));
          break;
        default:
          toSlice = token.length;
          break;
      }
      value = value.slice(toSlice);
    }
    return new Date(values["y"], values["M"], values["d"], values["h"], values["m"], values["s"], values["ms"]);
  }
  function getHours(date, is12Format) {
    let hours = date.getHours();
    if (is12Format) {
      hours = hours % 12;
      hours = hours ? hours : 12;
    }
    return hours;
  }
  function getAMPM(date) {
    return date.getHours() >= 12 ? "pm" : "am";
  }
  function getDayName(day) {
    return weekdays[day];
  }
  function getMonthName(month) {
    return monthNames[month];
  }
  function add(date, number, token) {
    if (!isDate(date) || !isNumber(number) || !isString(token)) {
      return date;
    }
    switch (token) {
      case "minutes":
      case "m":
        date.setMinutes(date.getMinutes() + number);
        break;
      case "hours":
      case "h":
        date.setHours(date.getHours() + number);
        break;
      case "days":
      case "d":
        date.setDate(date.getDate() + number);
        break;
      case "months":
      case "M":
        date.setMonth(date.getMonth() + number);
        break;
      case "years":
      case "Y":
        date.setFullYear(date.getFullYear() + number);
        break;
    }
    return self;
  }
  function createInterval(interval, token, min, max, formatText) {
    if (!isNumber(interval) || !isString(token) || !isDate(min) || !isDate(max)) {
      return [];
    }
    const formatFunc = formatText ? (value) => {
      return format(value, formatText);
    } : (value) => {
      return value;
    };
    let array = [];
    let currentDate = min;
    while (isBefore(currentDate, max)) {
      array.push(formatFunc(currentDate));
      add(currentDate, interval, token);
    }
    return array;
  }
  function getDate(value, formatText) {
    let text = isDate(value) ? format(value, formatText) : value;
    return createDate(text, formatText);
  }
  function isBefore(date1, date2) {
    return date1 < date2;
  }
  function isSameOrBefore(date1, date2) {
    return date1 <= date2;
  }
  function isAfter(date1, date2) {
    return date1 > date2;
  }
  function isSameOrAfter(date1, date2) {
    return date1 >= date2;
  }
  function isSame(date1, date2) {
    return date1.getTime() === date2.getTime();
  }
  function startOf(date, token) {
    if (!isDate(date) || !isString(token)) {
      return date;
    }
    switch (token) {
      case "week":
      case "w":
        add(date, -date.getDay(), "d");
        break;
      case "month":
      case "M":
        add(date, -date.getDate() + 1, "d");
        break;
      case "year":
      case "Y":
        startOf(date, "M").add(date, -date.getMonth(), "M");
        break;
      case "decade":
        startOf(date, "Y").add(date, -(date.getFullYear() % 10), "Y");
        break;
      case "century":
        startOf(date, "decade").add(date, -(date.getFullYear() % 100), "Y");
        break;
    }
    return self;
  }
  function endOf(date, token) {
    if (!isDate(date) || !isString(token)) {
      return date;
    }
    switch (token) {
      case "month":
      case "M":
        startOf(date, "M").add(date, 1, "M").add(date, -1, "d");
        break;
      case "year":
      case "Y":
        startOf(date, "Y").add(date, 1, "Y").add(date, -1, "d");
        break;
      case "decade":
        startOf(date, "decade").add(date, 10, "Y").add(date, -1, "d");
        break;
      case "century":
        startOf(date, "century").add(date, 100, "Y").add(date, -1, "d");
        break;
    }
    return self;
  }
  function cloneDate(date) {
    if (!isDate(date)) {
      return null;
    }
    return new Date(date.getTime());
  }
  function addZero(value, n) {
    return ("0" + value).slice(-n);
  }
  function isDate(value) {
    return value instanceof Date || Object.prototype.toString.call(value) === "[object Date]";
  }
  function isString(value) {
    return typeof value === "string" || value instanceof String || Object.prototype.toString.call(value) === "[object String]";
  }
  function isNumber(value) {
    return typeof value === "number" || Object.prototype.toString.call(value) === "[object Number]";
  }
};
tools.event = function MamboEventManager() {
  const m_eventDirectory = new MamboEventDirectory();
  const m_events = m_eventDirectory.events;
  const m_listeners = {};
  this.addEventListener = addEventListener;
  this.fireEvent = fireEvent;
  this.removeEventListener = removeEventListener;
  initializeListeners();
  function addEventListener(listener, event, fn) {
    if (event in m_listeners) {
      if (typeof fn === "function") {
        if (m_listeners[event][listener]) {
          alert(`ScEvents: event listener "${listener}" already exists. Please provide a listener with a unique name.`);
        } else {
          m_listeners[event][listener] = fn;
        }
      } else {
        alert(`ScEvents: event listener "${listener}" didn't provide a valid function type as a call back.`);
      }
    } else {
      alert(`ScEvents: event "${event}" does not exist. Please check available events in component ScEventsLibrary.`);
    }
  }
  function fireEvent(event, data) {
    if (event && data) {
      const ev = m_listeners[event];
      if (ev) {
        for (const key in ev) {
          if (key in ev) {
            ev[key](data);
          }
        }
      }
    }
  }
  function removeEventListener(listener, event) {
    if (listener && event) {
      delete m_listeners[event][listener];
    }
  }
  function initializeListeners() {
    for (const event in m_events) {
      if (event in m_events) {
        m_listeners[event] = {};
      }
    }
  }
};
function MamboEventDirectory() {
  this.events = {
    testEvent: "testEvent"
  };
}
tools.graphics = function MamboGraphics() {
  "use strict";
  let m_imageList = {
    "arrow-down-box-black": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAA3NCSVQICAjb4U/gAAAACXBIWXMAABt6AAAbegHgpi3aAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAP9QTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfOnhEQAAAFR0Uk5TAAIDBAUGBwgQGBscICEkJi8xMjQ2Nzg5Oz5CREZHZmlqbG1uc3SEhYuTm5yhoqanq6ytrq+wsbKztLW2t8DCxMbY2drb4Ojp6u3u8PP19vn6+/z+zSrt0gAAAzJJREFUeNrtm+1b0lAYh58VG5UgvS0IoxQlNCRyGmVKUgjEq0jn//9b+kCw52xz29nOi12d37eDl9d9y86rOw8AHaNUb3V6UyIg016nVS8ZEJZKY0gEZ9io3IkvXhEpuSoG4vMOkRYn7+fvjInEjHe8/P0lkZrlPs0/ItJzRP39REHQd7CzVCGw3PSD/JgoyXg9FhyiKM7f+cf/k8VAQBZ+zmpG8sx/82bVzoKAZO1qc+6ZEwEAKvRn3QIITKFL0yoA0MAf3NQMEBqjdoN5DQCDWv8OQHgOMG9oQIl6JoZ4AYPqcyWoo9ZsGyRke4aQdWih1jFIyTFCtqCDWntyBPYQsgM91LLlCNgI2QO0/1xYcgQsNCdOAdkMQFIGCKoFtIAW0AJaQAv8ywJPX7l5oELgB/rVR1pAC2gBLaAFtIAW0AL/iUDuWRyBF1uiBHL98fNoAXtyvSVGINcnBBsEC9gTQqIMkgnk+oRQBoEC9oSQSINEAis+NggSWPGjDJIIrPnIIEBgzY8wSCDg8l0Dv4DLDzdgF8D8jYFPAPNDDZgFnlD8tYFXgOYTcv2Ym4B1SQIMPAJePmmb/B5BoAEtwMBP0gmDDCgBH/9zhu8wtC58BligwsJPNhH5DUaoMWPhJ5yKfQYhOcuIWIysb5z4iZfjuAZR/OQbkngGp1H8FFsy65wHP82e0DznwE+1KY0ycGLw0+2Kza+p+Sm35WEGzkMQLxBicBKPn/pgYn5Jx09/Mgo2iM3ncDQLMvgUm8/jbGi2U/C5HE6938EJA5/P6ZgeC0x8TsdzbOAw8Xn9f8CdlU8zoEJgszqfMfL5vbRa7dKY+RzfmlkXUftPwQJgXbbZ+VzfG1omqBVIFC2gBbSAFtACWuB+CeBLrVk5/Cx1qVXxtd6f1MXmqhyBKkJ2qKvdTTkCTYRsUZfb5wUZ/AIus3hPX+/vyrjeTxVZFD0FDjXxAjXMGxiKSzw+wD0oclFe5qO+0El5qRfkR2r4o03hZ/lWBf+27PaPXRUCu7iHHsrnH9Jj5J3kp7B46x2lZak98ddr/zwhsfD598fgN+uySr+/v7xztpRS/P4mfLWSXf7/B8E1J8moHpGVAAAAAElFTkSuQmCC",
    "arrow-up-circle": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPG1ldGFkYXRhPiBTdmcgVmVjdG9yIEljb25zIDogaHR0cDovL3d3dy5vbmxpbmV3ZWJmb250cy5jb20vaWNvbiA8L21ldGFkYXRhPg0KPGc+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSI+PHBhdGggZD0iTTQ3MzIuMyw1MDEzLjlDMzEwNi42LDQ5MjUuNywxNjEzLjIsNDAxNyw3NzcuNCwyNjA0LjFjLTkzNy41LTE1ODMuNS04OTkuMS0zNTgzLDk3LjgtNTEzMC4xYzE4Ny45LTI5MS40LDM5MS4xLTU0MC42LDY2NS4yLTgxNC44YzIxMzkuNS0yMTQ1LjIsNTY2NS0xODU1LjcsNzQ0NCw2MDkuNmMxMTI5LjIsMTU2Mi40LDEyMjEuMiwzNjc1LDIzNS44LDUzMzkuMWMtNDEyLjIsNjk3LjgtMTAzMy4zLDEzMTktMTczMS4xLDE3MzEuMUM2NjYwLjksNDgyOS44LDU2OTQuNyw1MDY3LjUsNDczMi4zLDUwMTMuOXogTTU1ODEuNiw0NjEzLjJDNzM0Ny4yLDQ0MDQuMiw4ODU0LDMxMDQuNSw5MzYyLDEzNTYuMWMxMTUtNDAwLjcsMTY0LjktNzc0LjUsMTY0LjktMTIzNi41YzAtNzI4LjUtMTQxLjktMTM0Ny43LTQ2Mi0yMDAzLjNjLTcxMS4yLTE0NTMuMS0yMTc3LjgtMjQyNS4xLTM3OTUuOC0yNTE5Yy0xNjk2LjYtOTcuOC0zMjc2LjMsNzM4LjEtNDE2MC4xLDIyMDIuN0M4MDAuNC0xNjg4LjIsNTgzLjgtMTA2OSw1MDUuMi00NjUuMWMtNDAuMywzMTAuNi00MC4zLDg1MS4yLDAsMTE2OS40YzIzNS44LDE4MjcsMTU3MiwzMzM3LjYsMzM2OC4zLDM4MDUuNEM0NDE5LjgsNDY1MS41LDQ5NzAsNDY4Niw1NTgxLjYsNDYxMy4yeiIvPjxwYXRoIGQ9Ik0zNzM1LjQsNDM1LjljLTExNzcuMS0xMTc3LjEtMTE3OS0xMTc3LjEtMTE3OS0xMjU3LjZjMC02NS4yLDExLjUtODguMiw2NS4yLTEzNi4xYzEzMC40LTExNi45LDc4LjYtMTU5LjEsMTI5MC4yLDEwNTIuNWwxMDg4LjksMTA4OC45TDYwOTMuNCw5MC44QzcxNjguOS05ODQuNyw3MTg2LjItMTAwMS45LDcyNjAuOS0xMDAxLjljMTM4LDAsMjI4LjEsMTM4LDE2Ni44LDI1My4xYy0xNS4zLDI4LjgtNTQ4LjMsNTczLjItMTE4NC43LDEyMDkuN0w1MDg3LDE2MTQuOWgtODYuM2gtODYuM0wzNzM1LjQsNDM1Ljl6Ii8+PC9nPjwvZz4NCjwvc3ZnPg==",
    "hamburger-drawer-black": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPG1ldGFkYXRhPiBTdmcgVmVjdG9yIEljb25zIDogaHR0cDovL3d3dy5vbmxpbmV3ZWJmb250cy5jb20vaWNvbiA8L21ldGFkYXRhPg0KPGc+PHBhdGggZD0iTTU2LjcsMTUwaDg4Ni43YzI1LjgsMCw0Ni43LTIwLjksNDYuNy00Ni43YzAtMjUuOC0yMC45LTQ2LjctNDYuNy00Ni43SDU2LjdDMzAuOSw1Ni43LDEwLDc3LjYsMTAsMTAzLjNDMTAsMTI5LjEsMzAuOSwxNTAsNTYuNywxNTB6IE05NDMuMyw0NTMuM0g1Ni43QzMwLjksNDUzLjMsMTAsNDc0LjIsMTAsNTAwYzAsMjUuOCwyMC45LDQ2LjcsNDYuNyw0Ni43aDg4Ni43YzI1LjgsMCw0Ni43LTIwLjksNDYuNy00Ni43Qzk5MCw0NzQuMiw5NjkuMSw0NTMuMyw5NDMuMyw0NTMuM3ogTTk0My4zLDg1MEg1Ni43QzMwLjksODUwLDEwLDg3MC45LDEwLDg5Ni43czIwLjksNDYuNyw0Ni43LDQ2LjdoODg2LjdjMjUuOCwwLDQ2LjctMjAuOSw0Ni43LTQ2LjdTOTY5LjEsODUwLDk0My4zLDg1MHoiLz48L2c+DQo8L3N2Zz4=",
    "home-icon-white": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDUwIDUwIj48dGl0bGU+aG9tZTwvdGl0bGU+PHBvbHlnb24gcG9pbnRzPSI0NyAyMy45OCAyNC41IDEuNDggMiAyMy45OCA4LjA5IDI0IDguMDkgNDguNTIgMTguMzYgNDguNTIgMTguMzYgMzUuMTIgMzAuNjQgMzUuMTIgMzAuNjQgNDguNTIgNDAuOTEgNDguNTIgNDAuOTEgMjQgNDcgMjMuOTgiIHN0eWxlPSJmaWxsOiNmZmYiLz48L3N2Zz4=",
    "more": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzg0Ljk3IDM4NC45NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzg0Ljk3IDM4NC45NzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGcgaWQ9Ik1vcmVfVmVydGljYWwiPg0KCQk8cGF0aCBkPSJNMTkyLjQ4NSw5Ni4yNDJjMjYuNTc1LDAsNDguMTIxLTIxLjU0Niw0OC4xMjEtNDguMTIxUzIxOS4wNiwwLDE5Mi40ODUsMHMtNDguMTIxLDIxLjU0Ni00OC4xMjEsNDguMTIxDQoJCQlTMTY1LjkxLDk2LjI0MiwxOTIuNDg1LDk2LjI0MnogTTE5Mi40ODUsMjQuMDYxYzEzLjI5MywwLDI0LjA2MSwxMC43NzksMjQuMDYxLDI0LjA2MXMtMTAuNzY3LDI0LjA2MS0yNC4wNjEsMjQuMDYxDQoJCQlzLTI0LjA2MS0xMC43NjctMjQuMDYxLTI0LjA2MVMxNzkuMTkxLDI0LjA2MSwxOTIuNDg1LDI0LjA2MXoiLz4NCgkJPHBhdGggZD0iTTE5Mi40ODUsMjg4LjcyN2MtMjYuNTc1LDAtNDguMTIxLDIxLjU0Ni00OC4xMjEsNDguMTIxYzAsMjYuNTc1LDIxLjU0Niw0OC4xMjEsNDguMTIxLDQ4LjEyMQ0KCQkJczQ4LjEyMS0yMS41NDYsNDguMTIxLTQ4LjEyMUMyNDAuNjA2LDMxMC4yNzQsMjE5LjA2LDI4OC43MjcsMTkyLjQ4NSwyODguNzI3eiBNMTkyLjQ4NSwzNjAuOTA5DQoJCQljLTEzLjI5MywwLTI0LjA2MS0xMC43NjctMjQuMDYxLTI0LjA2MXMxMC43NjctMjQuMDYxLDI0LjA2MS0yNC4wNjFzMjQuMDYxLDEwLjc3OSwyNC4wNjEsMjQuMDYxDQoJCQlTMjA1Ljc3OCwzNjAuOTA5LDE5Mi40ODUsMzYwLjkwOXoiLz4NCgkJPHBhdGggZD0iTTE5Mi40ODUsMTQ0LjM2NGMtMjYuNTc1LDAtNDguMTIxLDIxLjU0Ni00OC4xMjEsNDguMTIxczIxLjU0Niw0OC4xMjEsNDguMTIxLDQ4LjEyMXM0OC4xMjEtMjEuNTQ2LDQ4LjEyMS00OC4xMjENCgkJCVMyMTkuMDYsMTQ0LjM2NCwxOTIuNDg1LDE0NC4zNjR6IE0xOTIuNDg1LDIxNi41NDVjLTEzLjI5MywwLTI0LjA2MS0xMC43NjctMjQuMDYxLTI0LjA2MXMxMC43NjctMjQuMDYxLDI0LjA2MS0yNC4wNjENCgkJCXMyNC4wNjEsMTAuNzc5LDI0LjA2MSwyNC4wNjFDMjE2LjU0NSwyMDUuNzY2LDIwNS43NzgsMjE2LjU0NSwxOTIuNDg1LDIxNi41NDV6Ii8+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=",
    "popup": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPG1ldGFkYXRhPiBTdmcgVmVjdG9yIEljb25zIDogaHR0cDovL3d3dy5vbmxpbmV3ZWJmb250cy5jb20vaWNvbiA8L21ldGFkYXRhPg0KPGc+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTExLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSI+PHBhdGggZD0iTTI1NjIsMTM0MXYtMzY2OWgzNjY5aDM2Njl2MzY2OXYzNjY5SDYyMzFIMjU2MlYxMzQxeiBNOTQ5My43LDEzNDF2LTMyNjIuN0g2MjMxSDI5NjguM1YxMzQxdjMyNjIuN0g2MjMxaDMyNjIuN1YxMzQxeiIvPjxwYXRoIGQ9Ik02MjE5LDM5OTQuMVYzNzkxaDEwODAuNGgxMDgyLjhMNjQ3MCwxODc4LjhMNDU1Ny44LTMzLjRsMTQzLjQtMTQzLjRsMTQzLjQtMTQzLjRsMTkwNSwxOTA1bDE5MDcuNCwxOTA3LjRsNC44LTEwNzUuNkw4NjY5LDEzNDFsMTk4LjQtNy4ybDE5Ni03LjJsMi40LDEyMS45YzAsNjQuNSwwLDY3NC4xLDAsMTM1MC41czAsMTI2OS4yLDAsMTMxNC42bC0yLjQsODMuN0g3NjQxLjJINjIxOVYzOTk0LjF6Ii8+PHBhdGggZD0iTTEwMCwyMTQxLjd2LTQwNi4zaDIwMy4yaDIwMy4ydjIwMy4ydjIwMy4yaDIwMy4yaDIwMy4ydjIwMy4yVjI1NDhINTA2LjNIMTAwVjIxNDEuN3oiLz48cGF0aCBkPSJNMTMyMy44LDIzNTJsNy4yLTE5OC40aDQwNi4zaDQwNi4zbDcuMiwxOTguNGw3LjIsMTk2aC00MjAuN2gtNDIwLjdMMTMyMy44LDIzNTJ6Ii8+PHBhdGggZD0iTTEwMCw5MjIuN1Y1MTYuM2gyMDMuMmgyMDMuMnY0MDYuM1YxMzI5SDMwMy4ySDEwMFY5MjIuN3oiLz48cGF0aCBkPSJNMTAwLTI5Ni4zdi00MDYuM2gyMDMuMmgyMDMuMnY0MDYuM1YxMTBIMzAzLjJIMTAwVi0yOTYuM3oiLz48cGF0aCBkPSJNMTAwLTE1MTUuNHYtNDA2LjNoMjAzLjJoMjAzLjJ2NDA2LjN2NDA2LjNIMzAzLjJIMTAwVi0xNTE1LjR6Ii8+PHBhdGggZD0iTTExNi43LTIzNDQuOGMtOS42LTcuMi0xNi43LTI4Ni44LTE2LjctNjIxLjVWLTM1NzFoMjAzLjJoMjAzLjJ2NjIxLjV2NjIxLjVIMzE5LjlDMjE3LjEtMjMyOCwxMjMuOS0yMzM1LjIsMTE2LjctMjM0NC44eiIvPjxwYXRoIGQ9Ik03MDQxLjMtMjc2NS41Yy00LjgtMTYuNy03LjItMjAzLjItNC44LTQxMS4xbDcuMi0zODIuNGwxOTguNC03LjJsMTk2LTcuMnY0MjAuN3Y0MTguM2gtMTkxLjJDNzExMC42LTI3MzQuNCw3MDUwLjgtMjc0NCw3MDQxLjMtMjc2NS41eiIvPjxwYXRoIGQ9Ik0xMDAtNDM4My43Vi00NzkwaDQwNi4zaDQwNi4zdjIwMy4ydjIwMy4ySDcwOS41SDUwNi4zdjIwMy4ydjIwMy4ySDMwMy4ySDEwMFYtNDM4My43eiIvPjxwYXRoIGQ9Ik03MDMxLjctNDE4MC41di0yMDMuMmgtMjAzLjJoLTIwMy4ydi0yMDMuMlYtNDc5MGg0MDYuM0g3NDM4djQwNi4zdjQwNi4zaC0yMDMuMmgtMjAzLjJWLTQxODAuNXoiLz48cGF0aCBkPSJNMTMyMy44LTQ1NzkuN2w3LjItMTk4LjRoNjA5LjVIMjU1MGw3LjIsMTk4LjRsNy4yLDE5NmgtNjIzLjloLTYyMy45TDEzMjMuOC00NTc5Ljd6Ii8+PHBhdGggZD0iTTI5NjguMy00NTg2LjhWLTQ3OTBoNDA2LjNIMzc4MXYyMDMuMnYyMDMuMmgtNDA2LjNoLTQwNi4zVi00NTg2Ljh6Ii8+PHBhdGggZD0iTTQxODcuMy00NTg2LjhWLTQ3OTBoNDA2LjNINTAwMHYyMDMuMnYyMDMuMmgtNDA2LjNoLTQwNi4zVi00NTg2Ljh6Ii8+PHBhdGggZD0iTTU0MDYuMy00NTg2LjhWLTQ3OTBoNDA2LjNINjIxOXYyMDMuMnYyMDMuMmgtNDA2LjNoLTQwNi4zVi00NTg2Ljh6Ii8+PC9nPjwvZz4NCjwvc3ZnPg==",
    "sc-logo": "data:image/png;base64,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",
    "sc-logo-s": "data:image/png;base64,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",
    "star": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADxElEQVRoQ9WZS+hVVRTGv1+ZL3Jg9kAqKKU0CHrQwwaWSlEgggi9KBLRQVKzIIheVtAkaBAoBilFTSpqFBFhD5pkFFQWUUEvKAhpYCBZ/qsvluwb19u5d+9z7jn/7l2Te+Cuvdb37fXYLzTlQpf4bZ8gaR5wpCs/XRNYL2k58NS0EvhU0unA0qkjkNLnT0kR5YVdpVFnKWR7naS30sxvB3Z3EYUuCeyXdGUC/RNw1tQQsB0T81dKnx7u+cAfbZPoJAK2V0l6fwDsFuDZaSHwjqQ1A2C/B86deAIpfaL7xCI2KHOBmTZJtJ5Cti+S9MkQkDcDL006gdckxQpcJV8DKyadQKTPiSNAzgGiQ7UiraaQ7ZjdLzPINgARpVakbQKR3zdmkB0Aok5akbYJHJV0UgaZJUUa/d0Gg9YI2D5H0neFoNYBsVaMLdi+RNL8vsILUr0i7P8OZ9HbBwu0N+PbJG0oRBTb7IeS7uC6EJHpL/L4jqiF9H+H3kwQCFAxG1cXOp8UtWgWF/+bQrbvkPTcpKDL4LgfeDx0jqsB20skfSUpfidR4mx9IfBtD1xlEduOXePmCWOwT9L1g91raBeyvVrSu0M2ZbPJLQr4VuDFKqcj26jteZIOSDp/NhH3+TooaQVwaJj/onXA9g5JD88yib3A1pzPIgJhxPZKSdG/5+aMjvl/9Pe1wHsldooJJBJzJH0g6dIS4w10fpB0QZ0rmFoEeoBs3yfpWB9uUXYD2+vaa0QgRSO6VFGYC0BtBfYW6P1HZRwCD0h6rInTijEvAzc1sTUOgV9aXLFngEbNoREB2wsk/dZkxkaMORv4sa7NpgSi2HbVdZbRfxq4s67NpgRips6s6yyjfwRYWNdmbQK2I1dbv+NMwE8DoraKpQmB2yU9X+hhT2q1peeMJ4B7C20fU2tC4BtJyzJOIkKXA5+lNePUdM44JTPuMLCoMwK2YyuRu9uM4+m1VbcOtl+QdFsG4OJRu8/BsbUiYHuTpFeGAIh9+y25u0/b10h6e8Q5YwfwSGkU6hL4IjZbFcZ/lrQS+LXEse24BYlzxnkV+oeAxSV2atVAur2outPcBdxV6rBfz/aDkh6tGLsIOFxiszgCtq+T9Gaf0bjEvQr4qMTRMB3b8ejxebxk9uncAzxZYrcOgQ8lXZaMfizpCiBIjC3pUeR1STckYweBM0oMFxEYeLS7G9hZYryuju2Nkl5N7X0B8HvORimBeLR7IxVqFGxnYvtkSdEsohtlzwilBDYDpatpK+RsbwOeyRkrIpAz8n/+/w9yPSt2FCZ6UwAAAABJRU5ErkJggg==",
    "three-dots-icon-black": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQwOHB4IiBoZWlnaHQ9IjQwOHB4IiB2aWV3Qm94PSIwIDAgNDA4IDQwOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDA4IDQwODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGcgaWQ9Im1vcmUtdmVydCI+DQoJCTxwYXRoIGQ9Ik0yMDQsMTAyYzI4LjA1LDAsNTEtMjIuOTUsNTEtNTFTMjMyLjA1LDAsMjA0LDBzLTUxLDIyLjk1LTUxLDUxUzE3NS45NSwxMDIsMjA0LDEwMnogTTIwNCwxNTNjLTI4LjA1LDAtNTEsMjIuOTUtNTEsNTENCgkJCXMyMi45NSw1MSw1MSw1MXM1MS0yMi45NSw1MS01MVMyMzIuMDUsMTUzLDIwNCwxNTN6IE0yMDQsMzA2Yy0yOC4wNSwwLTUxLDIyLjk1LTUxLDUxczIyLjk1LDUxLDUxLDUxczUxLTIyLjk1LDUxLTUxDQoJCQlTMjMyLjA1LDMwNiwyMDQsMzA2eiIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K",
    "x-black": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPG1ldGFkYXRhPiBTdmcgVmVjdG9yIEljb25zIDogaHR0cDovL3d3dy5vbmxpbmV3ZWJmb250cy5jb20vaWNvbiA8L21ldGFkYXRhPg0KPGc+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSI+PHBhdGggZD0iTTYzMC4yLDQ0ODkuOEwxMDAsMzk1Ny43bDE5MTcuOS0xOTE3LjlMMzkzNy43LDEyMEwyMDE3LjktMTc5OS44TDEwMC0zNzE3LjdsNTMwLjItNTMyLjFsNTMyLjEtNTMwLjJsMTkxNy45LDE5MTcuOUw1MDAwLTk0Mi4zbDE5MTkuOC0xOTE5LjhMODgzNy43LTQ3ODBsNTMyLjEsNTMwLjJsNTMwLjIsNTMyLjFMNzk4Mi4xLTE3OTkuOEw2MDYyLjMsMTIwbDE5MTkuOCwxOTE5LjhMOTkwMCwzOTU3LjdsLTUzMC4yLDUzMi4xTDg4MzcuNyw1MDIwTDY5MTkuOCwzMTAyLjFMNTAwMCwxMTgyLjNMMzA4MC4yLDMxMDIuMUwxMTYyLjMsNTAyMEw2MzAuMiw0NDg5Ljh6Ii8+PC9nPjwvZz4NCjwvc3ZnPg=="
  };
  let m_svgList = {
    "attachment": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M4.317,16.411c-1.423-1.423-1.423-3.737,0-5.16l8.075-7.984c0.994-0.996,2.613-0.996,3.611,0.001C17,4.264,17,5.884,16.004,6.88l-8.075,7.984c-0.568,0.568-1.493,0.569-2.063-0.001c-0.569-0.569-0.569-1.495,0-2.064L9.93,8.828c0.145-0.141,0.376-0.139,0.517,0.005c0.141,0.144,0.139,0.375-0.006,0.516l-4.062,3.968c-0.282,0.282-0.282,0.745,0.003,1.03c0.285,0.284,0.747,0.284,1.032,0l8.074-7.985c0.711-0.71,0.711-1.868-0.002-2.579c-0.711-0.712-1.867-0.712-2.58,0l-8.074,7.984c-1.137,1.137-1.137,2.988,0.001,4.127c1.14,1.14,2.989,1.14,4.129,0l6.989-6.896c0.143-0.142,0.375-0.14,0.516,0.003c0.143,0.143,0.141,0.374-0.002,0.516l-6.988,6.895C8.054,17.836,5.743,17.836,4.317,16.411"]
    },
    "calendar": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M16.254,3.399h-0.695V3.052c0-0.576-0.467-1.042-1.041-1.042c-0.576,0-1.043,0.467-1.043,1.042v0.347H6.526V3.052c0-0.576-0.467-1.042-1.042-1.042S4.441,2.476,4.441,3.052v0.347H3.747c-0.768,0-1.39,0.622-1.39,1.39v11.813c0,0.768,0.622,1.39,1.39,1.39h12.507c0.768,0,1.391-0.622,1.391-1.39V4.789C17.645,4.021,17.021,3.399,16.254,3.399z M14.17,3.052c0-0.192,0.154-0.348,0.348-0.348c0.191,0,0.348,0.156,0.348,0.348v0.347H14.17V3.052z M5.136,3.052c0-0.192,0.156-0.348,0.348-0.348S5.831,2.86,5.831,3.052v0.347H5.136V3.052z M16.949,16.602c0,0.384-0.311,0.694-0.695,0.694H3.747c-0.384,0-0.695-0.311-0.695-0.694V7.568h13.897V16.602z M16.949,6.874H3.052V4.789c0-0.383,0.311-0.695,0.695-0.695h12.507c0.385,0,0.695,0.312,0.695,0.695V6.874z M5.484,11.737c0.576,0,1.042-0.467,1.042-1.042c0-0.576-0.467-1.043-1.042-1.043s-1.042,0.467-1.042,1.043C4.441,11.271,4.908,11.737,5.484,11.737z M5.484,10.348c0.192,0,0.347,0.155,0.347,0.348c0,0.191-0.155,0.348-0.347,0.348s-0.348-0.156-0.348-0.348C5.136,10.503,5.292,10.348,5.484,10.348z M14.518,11.737c0.574,0,1.041-0.467,1.041-1.042c0-0.576-0.467-1.043-1.041-1.043c-0.576,0-1.043,0.467-1.043,1.043C13.475,11.271,13.941,11.737,14.518,11.737z M14.518,10.348c0.191,0,0.348,0.155,0.348,0.348c0,0.191-0.156,0.348-0.348,0.348c-0.193,0-0.348-0.156-0.348-0.348C14.17,10.503,14.324,10.348,14.518,10.348z M14.518,15.212c0.574,0,1.041-0.467,1.041-1.043c0-0.575-0.467-1.042-1.041-1.042c-0.576,0-1.043,0.467-1.043,1.042C13.475,14.745,13.941,15.212,14.518,15.212z M14.518,13.822c0.191,0,0.348,0.155,0.348,0.347c0,0.192-0.156,0.348-0.348,0.348c-0.193,0-0.348-0.155-0.348-0.348C14.17,13.978,14.324,13.822,14.518,13.822z M10,15.212c0.575,0,1.042-0.467,1.042-1.043c0-0.575-0.467-1.042-1.042-1.042c-0.576,0-1.042,0.467-1.042,1.042C8.958,14.745,9.425,15.212,10,15.212z M10,13.822c0.192,0,0.348,0.155,0.348,0.347c0,0.192-0.156,0.348-0.348,0.348s-0.348-0.155-0.348-0.348C9.653,13.978,9.809,13.822,10,13.822z M5.484,15.212c0.576,0,1.042-0.467,1.042-1.043c0-0.575-0.467-1.042-1.042-1.042s-1.042,0.467-1.042,1.042C4.441,14.745,4.908,15.212,5.484,15.212z M5.484,13.822c0.192,0,0.347,0.155,0.347,0.347c0,0.192-0.155,0.348-0.347,0.348s-0.348-0.155-0.348-0.348C5.136,13.978,5.292,13.822,5.484,13.822z M10,11.737c0.575,0,1.042-0.467,1.042-1.042c0-0.576-0.467-1.043-1.042-1.043c-0.576,0-1.042,0.467-1.042,1.043C8.958,11.271,9.425,11.737,10,11.737z M10,10.348c0.192,0,0.348,0.155,0.348,0.348c0,0.191-0.156,0.348-0.348,0.348s-0.348-0.156-0.348-0.348C9.653,10.503,9.809,10.348,10,10.348z"]
    },
    "cog": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M17.498,11.697c-0.453-0.453-0.704-1.055-0.704-1.697c0-0.642,0.251-1.244,0.704-1.697c0.069-0.071,0.15-0.141,0.257-0.22c0.127-0.097,0.181-0.262,0.137-0.417c-0.164-0.558-0.388-1.093-0.662-1.597c-0.075-0.141-0.231-0.22-0.391-0.199c-0.13,0.02-0.238,0.027-0.336,0.027c-1.325,0-2.401-1.076-2.401-2.4c0-0.099,0.008-0.207,0.027-0.336c0.021-0.158-0.059-0.316-0.199-0.391c-0.503-0.274-1.039-0.498-1.597-0.662c-0.154-0.044-0.32,0.01-0.416,0.137c-0.079,0.106-0.148,0.188-0.22,0.257C11.244,2.956,10.643,3.207,10,3.207c-0.642,0-1.244-0.25-1.697-0.704c-0.071-0.069-0.141-0.15-0.22-0.257C7.987,2.119,7.821,2.065,7.667,2.109C7.109,2.275,6.571,2.497,6.07,2.771C5.929,2.846,5.85,3.004,5.871,3.162c0.02,0.129,0.027,0.237,0.027,0.336c0,1.325-1.076,2.4-2.401,2.4c-0.098,0-0.206-0.007-0.335-0.027C3.001,5.851,2.845,5.929,2.77,6.07C2.496,6.572,2.274,7.109,2.108,7.667c-0.044,0.154,0.01,0.32,0.137,0.417c0.106,0.079,0.187,0.148,0.256,0.22c0.938,0.936,0.938,2.458,0,3.394c-0.069,0.072-0.15,0.141-0.256,0.221c-0.127,0.096-0.181,0.262-0.137,0.416c0.166,0.557,0.388,1.096,0.662,1.596c0.075,0.143,0.231,0.221,0.392,0.199c0.129-0.02,0.237-0.027,0.335-0.027c1.325,0,2.401,1.076,2.401,2.402c0,0.098-0.007,0.205-0.027,0.334C5.85,16.996,5.929,17.154,6.07,17.23c0.501,0.273,1.04,0.496,1.597,0.66c0.154,0.047,0.32-0.008,0.417-0.137c0.079-0.105,0.148-0.186,0.22-0.256c0.454-0.453,1.055-0.703,1.697-0.703c0.643,0,1.244,0.25,1.697,0.703c0.071,0.07,0.141,0.15,0.22,0.256c0.073,0.098,0.188,0.152,0.307,0.152c0.036,0,0.073-0.004,0.109-0.016c0.558-0.164,1.096-0.387,1.597-0.66c0.141-0.076,0.22-0.234,0.199-0.393c-0.02-0.129-0.027-0.236-0.027-0.334c0-1.326,1.076-2.402,2.401-2.402c0.098,0,0.206,0.008,0.336,0.027c0.159,0.021,0.315-0.057,0.391-0.199c0.274-0.5,0.496-1.039,0.662-1.596c0.044-0.154-0.01-0.32-0.137-0.416C17.648,11.838,17.567,11.77,17.498,11.697 M16.671,13.334c-0.059-0.002-0.114-0.002-0.168-0.002c-1.749,0-3.173,1.422-3.173,3.172c0,0.053,0.002,0.109,0.004,0.166c-0.312,0.158-0.64,0.295-0.976,0.406c-0.039-0.045-0.077-0.086-0.115-0.123c-0.601-0.6-1.396-0.93-2.243-0.93s-1.643,0.33-2.243,0.93c-0.039,0.037-0.077,0.078-0.116,0.123c-0.336-0.111-0.664-0.248-0.976-0.406c0.002-0.057,0.004-0.113,0.004-0.166c0-1.75-1.423-3.172-3.172-3.172c-0.054,0-0.11,0-0.168,0.002c-0.158-0.312-0.293-0.639-0.405-0.975c0.044-0.039,0.085-0.078,0.124-0.115c1.236-1.236,1.236-3.25,0-4.486C3.009,7.719,2.969,7.68,2.924,7.642c0.112-0.336,0.247-0.664,0.405-0.976C3.387,6.668,3.443,6.67,3.497,6.67c1.75,0,3.172-1.423,3.172-3.172c0-0.054-0.002-0.11-0.004-0.168c0.312-0.158,0.64-0.293,0.976-0.405C7.68,2.969,7.719,3.01,7.757,3.048c0.6,0.6,1.396,0.93,2.243,0.93s1.643-0.33,2.243-0.93c0.038-0.039,0.076-0.079,0.115-0.123c0.336,0.112,0.663,0.247,0.976,0.405c-0.002,0.058-0.004,0.114-0.004,0.168c0,1.749,1.424,3.172,3.173,3.172c0.054,0,0.109-0.002,0.168-0.004c0.158,0.312,0.293,0.64,0.405,0.976c-0.045,0.038-0.086,0.077-0.124,0.116c-0.6,0.6-0.93,1.396-0.93,2.242c0,0.847,0.33,1.645,0.93,2.244c0.038,0.037,0.079,0.076,0.124,0.115C16.964,12.695,16.829,13.021,16.671,13.334 M10,5.417c-2.528,0-4.584,2.056-4.584,4.583c0,2.529,2.056,4.584,4.584,4.584s4.584-2.055,4.584-4.584C14.584,7.472,12.528,5.417,10,5.417 M10,13.812c-2.102,0-3.812-1.709-3.812-3.812c0-2.102,1.71-3.812,3.812-3.812c2.102,0,3.812,1.71,3.812,3.812C13.812,12.104,12.102,13.812,10,13.812"]
    },
    "device": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M14.911,1.295H5.09c-0.737,0-1.339,0.603-1.339,1.339v14.733c0,0.736,0.603,1.338,1.339,1.338h9.821c0.737,0,1.339-0.602,1.339-1.338V2.634C16.25,1.898,15.648,1.295,14.911,1.295 M15.357,17.367c0,0.24-0.205,0.445-0.446,0.445H5.09c-0.241,0-0.446-0.205-0.446-0.445v-0.893h10.714V17.367z M15.357,15.58H4.644V4.42h10.714V15.58z M15.357,3.527H4.644V2.634c0-0.241,0.205-0.446,0.446-0.446h9.821c0.241,0,0.446,0.206,0.446,0.446V3.527z"]
    },
    "home": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M18.121,9.88l-7.832-7.836c-0.155-0.158-0.428-0.155-0.584,0L1.842,9.913c-0.262,0.263-0.073,0.705,0.292,0.705h2.069v7.042c0,0.227,0.187,0.414,0.414,0.414h3.725c0.228,0,0.414-0.188,0.414-0.414v-3.313h2.483v3.313c0,0.227,0.187,0.414,0.413,0.414h3.726c0.229,0,0.414-0.188,0.414-0.414v-7.042h2.068h0.004C18.331,10.617,18.389,10.146,18.121,9.88 M14.963,17.245h-2.896v-3.313c0-0.229-0.186-0.415-0.414-0.415H8.342c-0.228,0-0.414,0.187-0.414,0.415v3.313H5.032v-6.628h9.931V17.245z M3.133,9.79l6.864-6.868l6.867,6.868H3.133z"]
    },
    "monitor": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M17.237,3.056H2.93c-0.694,0-1.263,0.568-1.263,1.263v8.837c0,0.694,0.568,1.263,1.263,1.263h4.629v0.879c-0.015,0.086-0.183,0.306-0.273,0.423c-0.223,0.293-0.455,0.592-0.293,0.92c0.07,0.139,0.226,0.303,0.577,0.303h4.819c0.208,0,0.696,0,0.862-0.379c0.162-0.37-0.124-0.682-0.374-0.955c-0.089-0.097-0.231-0.252-0.268-0.328v-0.862h4.629c0.694,0,1.263-0.568,1.263-1.263V4.319C18.5,3.625,17.932,3.056,17.237,3.056 M8.053,16.102C8.232,15.862,8.4,15.597,8.4,15.309v-0.89h3.366v0.89c0,0.303,0.211,0.562,0.419,0.793H8.053z M17.658,13.156c0,0.228-0.193,0.421-0.421,0.421H2.93c-0.228,0-0.421-0.193-0.421-0.421v-1.263h15.149V13.156z M17.658,11.052H2.509V4.319c0-0.228,0.193-0.421,0.421-0.421h14.308c0.228,0,0.421,0.193,0.421,0.421V11.052z"]
    },
    "link": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M16.469,8.924l-2.414,2.413c-0.156,0.156-0.408,0.156-0.564,0c-0.156-0.155-0.156-0.408,0-0.563l2.414-2.414c1.175-1.175,1.175-3.087,0-4.262c-0.57-0.569-1.326-0.883-2.132-0.883s-1.562,0.313-2.132,0.883L9.227,6.511c-1.175,1.175-1.175,3.087,0,4.263c0.288,0.288,0.624,0.511,0.997,0.662c0.204,0.083,0.303,0.315,0.22,0.52c-0.171,0.422-0.643,0.17-0.52,0.22c-0.473-0.191-0.898-0.474-1.262-0.838c-1.487-1.485-1.487-3.904,0-5.391l2.414-2.413c0.72-0.72,1.678-1.117,2.696-1.117s1.976,0.396,2.696,1.117C17.955,5.02,17.955,7.438,16.469,8.924 M10.076,7.825c-0.205-0.083-0.437,0.016-0.52,0.22c-0.083,0.205,0.016,0.437,0.22,0.52c0.374,0.151,0.709,0.374,0.997,0.662c1.176,1.176,1.176,3.088,0,4.263l-2.414,2.413c-0.569,0.569-1.326,0.883-2.131,0.883s-1.562-0.313-2.132-0.883c-1.175-1.175-1.175-3.087,0-4.262L6.51,9.227c0.156-0.155,0.156-0.408,0-0.564c-0.156-0.156-0.408-0.156-0.564,0l-2.414,2.414c-1.487,1.485-1.487,3.904,0,5.391c0.72,0.72,1.678,1.116,2.696,1.116s1.976-0.396,2.696-1.116l2.414-2.413c1.487-1.486,1.487-3.905,0-5.392C10.974,8.298,10.55,8.017,10.076,7.825"]
    },
    "phone": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M13.372,1.781H6.628c-0.696,0-1.265,0.569-1.265,1.265v13.91c0,0.695,0.569,1.265,1.265,1.265h6.744c0.695,0,1.265-0.569,1.265-1.265V3.045C14.637,2.35,14.067,1.781,13.372,1.781 M13.794,16.955c0,0.228-0.194,0.421-0.422,0.421H6.628c-0.228,0-0.421-0.193-0.421-0.421v-0.843h7.587V16.955z M13.794,15.269H6.207V4.731h7.587V15.269z M13.794,3.888H6.207V3.045c0-0.228,0.194-0.421,0.421-0.421h6.744c0.228,0,0.422,0.194,0.422,0.421V3.888z"]
    },
    "refresh": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M19.305,9.61c-0.235-0.235-0.615-0.235-0.85,0l-1.339,1.339c0.045-0.311,0.073-0.626,0.073-0.949c0-3.812-3.09-6.901-6.901-6.901c-2.213,0-4.177,1.045-5.44,2.664l0.897,0.719c1.053-1.356,2.693-2.232,4.543-2.232c3.176,0,5.751,2.574,5.751,5.751c0,0.342-0.037,0.675-0.095,1l-1.746-1.39c-0.234-0.235-0.614-0.235-0.849,0c-0.235,0.235-0.235,0.615,0,0.85l2.823,2.25c0.122,0.121,0.282,0.177,0.441,0.172c0.159,0.005,0.32-0.051,0.44-0.172l2.25-2.25C19.539,10.225,19.539,9.845,19.305,9.61z M10.288,15.752c-3.177,0-5.751-2.575-5.751-5.752c0-0.276,0.025-0.547,0.062-0.813l1.203,1.203c0.235,0.234,0.615,0.234,0.85,0c0.234-0.235,0.234-0.615,0-0.85l-2.25-2.25C4.281,7.169,4.121,7.114,3.961,7.118C3.802,7.114,3.642,7.169,3.52,7.291l-2.824,2.25c-0.234,0.235-0.234,0.615,0,0.85c0.235,0.234,0.615,0.234,0.85,0l1.957-1.559C3.435,9.212,3.386,9.6,3.386,10c0,3.812,3.09,6.901,6.902,6.901c2.083,0,3.946-0.927,5.212-2.387l-0.898-0.719C13.547,14.992,12.008,15.752,10.288,15.752z"]
    },
    "remove": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"]
    },
    "save": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M17.064,4.656l-2.05-2.035C14.936,2.544,14.831,2.5,14.721,2.5H3.854c-0.229,0-0.417,0.188-0.417,0.417v14.167c0,0.229,0.188,0.417,0.417,0.417h12.917c0.229,0,0.416-0.188,0.416-0.417V4.952C17.188,4.84,17.144,4.733,17.064,4.656M6.354,3.333h7.917V10H6.354V3.333z M16.354,16.667H4.271V3.333h1.25v7.083c0,0.229,0.188,0.417,0.417,0.417h8.75c0.229,0,0.416-0.188,0.416-0.417V3.886l1.25,1.239V16.667z M13.402,4.688v3.958c0,0.229-0.186,0.417-0.417,0.417c-0.229,0-0.417-0.188-0.417-0.417V4.688c0-0.229,0.188-0.417,0.417-0.417C13.217,4.271,13.402,4.458,13.402,4.688"]
    },
    "search": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"]
    },
    "share": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M14.68,12.621c-0.9,0-1.702,0.43-2.216,1.09l-4.549-2.637c0.284-0.691,0.284-1.457,0-2.146l4.549-2.638c0.514,0.661,1.315,1.09,2.216,1.09c1.549,0,2.809-1.26,2.809-2.808c0-1.548-1.26-2.809-2.809-2.809c-1.548,0-2.808,1.26-2.808,2.809c0,0.38,0.076,0.741,0.214,1.073l-4.55,2.638c-0.515-0.661-1.316-1.09-2.217-1.09c-1.548,0-2.808,1.26-2.808,2.809s1.26,2.808,2.808,2.808c0.9,0,1.702-0.43,2.217-1.09l4.55,2.637c-0.138,0.332-0.214,0.693-0.214,1.074c0,1.549,1.26,2.809,2.808,2.809c1.549,0,2.809-1.26,2.809-2.809S16.229,12.621,14.68,12.621M14.68,2.512c1.136,0,2.06,0.923,2.06,2.06S15.815,6.63,14.68,6.63s-2.059-0.923-2.059-2.059S13.544,2.512,14.68,2.512M5.319,12.061c-1.136,0-2.06-0.924-2.06-2.06s0.923-2.059,2.06-2.059c1.135,0,2.06,0.923,2.06,2.059S6.454,12.061,5.319,12.061M14.68,17.488c-1.136,0-2.059-0.922-2.059-2.059s0.923-2.061,2.059-2.061s2.06,0.924,2.06,2.061S15.815,17.488,14.68,17.488"]
    },
    "star": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M17.684,7.925l-5.131-0.67L10.329,2.57c-0.131-0.275-0.527-0.275-0.658,0L7.447,7.255l-5.131,0.67C2.014,7.964,1.892,8.333,2.113,8.54l3.76,3.568L4.924,17.21c-0.056,0.297,0.261,0.525,0.533,0.379L10,15.109l4.543,2.479c0.273,0.153,0.587-0.089,0.533-0.379l-0.949-5.103l3.76-3.568C18.108,8.333,17.986,7.964,17.684,7.925 M13.481,11.723c-0.089,0.083-0.129,0.205-0.105,0.324l0.848,4.547l-4.047-2.208c-0.055-0.03-0.116-0.045-0.176-0.045s-0.122,0.015-0.176,0.045l-4.047,2.208l0.847-4.547c0.023-0.119-0.016-0.241-0.105-0.324L3.162,8.54L7.74,7.941c0.124-0.016,0.229-0.093,0.282-0.203L10,3.568l1.978,4.17c0.053,0.11,0.158,0.187,0.282,0.203l4.578,0.598L13.481,11.723z"]
    },
    "user": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"]
    },
    "view": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M10,6.978c-1.666,0-3.022,1.356-3.022,3.022S8.334,13.022,10,13.022s3.022-1.356,3.022-3.022S11.666,6.978,10,6.978M10,12.267c-1.25,0-2.267-1.017-2.267-2.267c0-1.25,1.016-2.267,2.267-2.267c1.251,0,2.267,1.016,2.267,2.267C12.267,11.25,11.251,12.267,10,12.267 M18.391,9.733l-1.624-1.639C14.966,6.279,12.563,5.278,10,5.278S5.034,6.279,3.234,8.094L1.609,9.733c-0.146,0.147-0.146,0.386,0,0.533l1.625,1.639c1.8,1.815,4.203,2.816,6.766,2.816s4.966-1.001,6.767-2.816l1.624-1.639C18.536,10.119,18.536,9.881,18.391,9.733 M16.229,11.373c-1.656,1.672-3.868,2.594-6.229,2.594s-4.573-0.922-6.23-2.594L2.41,10l1.36-1.374C5.427,6.955,7.639,6.033,10,6.033s4.573,0.922,6.229,2.593L17.59,10L16.229,11.373z"]
    },
    "watch": {
      attr: { "viewBox": "0 0 20 20" },
      paths: ["M10.25,2.375c-4.212,0-7.625,3.413-7.625,7.625s3.413,7.625,7.625,7.625s7.625-3.413,7.625-7.625S14.462,2.375,10.25,2.375M10.651,16.811v-0.403c0-0.221-0.181-0.401-0.401-0.401s-0.401,0.181-0.401,0.401v0.403c-3.443-0.201-6.208-2.966-6.409-6.409h0.404c0.22,0,0.401-0.181,0.401-0.401S4.063,9.599,3.843,9.599H3.439C3.64,6.155,6.405,3.391,9.849,3.19v0.403c0,0.22,0.181,0.401,0.401,0.401s0.401-0.181,0.401-0.401V3.19c3.443,0.201,6.208,2.965,6.409,6.409h-0.404c-0.22,0-0.4,0.181-0.4,0.401s0.181,0.401,0.4,0.401h0.404C16.859,13.845,14.095,16.609,10.651,16.811 M12.662,12.412c-0.156,0.156-0.409,0.159-0.568,0l-2.127-2.129C9.986,10.302,9.849,10.192,9.849,10V5.184c0-0.221,0.181-0.401,0.401-0.401s0.401,0.181,0.401,0.401v4.651l2.011,2.008C12.818,12.001,12.818,12.256,12.662,12.412"]
    }
  };
  this.getImage = getImage;
  this.getImages = getImages;
  this.getSVG = getSVG;
  function getImage(context = {}) {
    return getGraphic(context.name, m_imageList);
  }
  function getImages() {
    return m_imageList;
  }
  function getSVG(context = {}) {
    return getGraphic(context.name, m_svgList);
  }
  function getGraphic(name, list) {
    if (!(name in list)) {
      console.error(`Graphics: graphic ${name} was not found.`);
      return;
    }
    return list[name];
  }
  function getImageFromServer(url) {
    mambo.api.getFile(url).then((file) => {
      console.log(file);
    }).catch((xhr) => {
      console.log(xhr.responseText);
    });
  }
};
tools.history = function MamboHistoryManager(path) {
  "use strict";
  this.clearState = clearState;
  this.pushState = pushState;
  this.replaceState = replaceState;
  this.go = goToState;
  this.back = backState;
  this.forward = forwardState;
  const popstate = new Event("popstate");
  const locationchange = new Event("locationchange");
  let self = this;
  setupEventHandler();
  checkHistory();
  function pushState(state, title, path2) {
    setPageTitle(title);
    history.pushState(state, title, path2);
    window.dispatchEvent(popstate);
  }
  function clearState(state, title) {
    setPageTitle(title);
    history.replaceState({ path: "/" }, title, "/");
    window.dispatchEvent(popstate);
  }
  function replaceState(state, title, path2) {
    setPageTitle(title);
    history.replaceState(state, title, path2);
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
    const titleTag = dom.getTag("title", "head");
    if (title && titleTag) {
      titleTag.innerText = title;
    }
  }
  function setupEventHandler() {
    window.addEventListener("popstate", (ev) => {
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
tools.ipfs = function MamboIPFS() {
  let ipfs;
  let readFile;
  const parserm3u8 = new m3u8Parser.Parser();
  async function testAsyncIterator() {
    let playlist;
    for await (const chunk of ipfs.cat("QmdccEyrTxfvMiKAkQYBs9h8XDyZ6Hw8JJjRGGpVmyyZjF")) {
      console.info(chunk);
      playlist = chunk;
    }
    parserm3u8.push(playlist);
    parserm3u8.end();
    console.table(parserm3u8.manifest.segments);
  }
  function setupHls() {
    Hls.DefaultConfig.loader = HlsjsIpfsLoader;
    Hls.DefaultConfig.debug = false;
    const isSup = Hls.isSupported();
    if (isSup) {
      const video = document.createElement("video");
      const hls = new Hls();
      hls.config.ipfs = ipfs;
      hls.config.ipfsHash = "QmdccEyrTxfvMiKAkQYBs9h8XDyZ6Hw8JJjRGGpVmyyZjF";
      hls.loadSource("master.m3u8");
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    }
  }
  function conSetup() {
  }
};
tools.object = function MamboObjectManager() {
  "use strict";
  let store = {};
  this.get = (name) => store[name];
  this.save = saveObject;
  this.remove = (name) => delete store[name];
  this.getLibrary = () => store;
  this.clearLibrary = () => store = {};
  function saveObject(object, name) {
    const objName = name ? name : object.constructor.name;
    store[objName] = object;
  }
};
tools.router = function MamboRouterManager() {
  const self = this;
  window.addEventListener("locationchange", (ev) => {
    setRoute();
  });
  let current = {
    name: "",
    path: "",
    from: {
      name: "",
      path: ""
    },
    to: {
      name: "",
      path: ""
    },
    params: {},
    query: ""
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
      if (mambo.develop)
        alert(`MamboRouter: .routes() no duplicate name or path parameter in route object`);
      return false;
    }
    return true;
  }
  function checkRoutesFormat(args) {
    const isValidFormat = args.every((obj) => obj.constructor.name === "Object" && "path" in obj && typeof obj.path === "string" && obj.path.trim() !== "");
    if (!isValidFormat) {
      if (mambo.develop) {
        alert(`MamboRouter: .routes() expected an object with valid path`);
      }
      return false;
    }
    return true;
  }
  function getSetRoutes(args) {
    if (!args) {
      return routesList;
    }
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
        init();
      }
      return;
    }
    if (mambo.develop) {
      alert(`MamboRouter: .routes() expected an Array object`);
    }
  }
  function init() {
    const { matched, path } = matchedRouteBy({ path: location.pathname });
    if (matched) {
      historyManager = new tools.history(path);
    } else {
      if (mambo.develop)
        alert(`MamboRouter: No initial route matched`);
    }
  }
  function isCurrentRoute(routeObject) {
    if (routeObject.path === self.current.path) {
      return true;
    }
    return false;
  }
  function isValidRouteObject(args, type) {
    if (!routesList.length) {
      if (mambo.develop) {
        alert(`MamboRouter: .routes() is empty. Please, set a route`);
      }
      return false;
    }
    if (args && args.constructor.name === "Object") {
      const allowedKeysList = [
        { name: "path", type: "String" },
        { name: "name", type: "String" },
        { name: "params", type: "Object" },
        { name: "query", type: "String" },
        { name: "hash", type: "String" }
      ];
      let wrongKeysValues = [];
      const isAllKeysValid = Object.entries(args).every((arr) => {
        let allowed = allowedKeysList.filter((obj) => obj.name === arr[0] && obj.type === arr[1].constructor.name);
        if (!allowed.length) {
          wrongKeysValues.push(arr);
        }
        return allowed.length > 0;
      });
      if (isAllKeysValid) {
        return true;
      } else {
        if (mambo.develop) {
          alert(`MamboRouter: ${wrongKeysValues} is not valid in ${type}(${JSON.stringify(args)})`);
        }
        return false;
      }
    }
    if (mambo.develop) {
      alert(`MamboRouter: .${type}() expected a valid Object `);
    }
    return false;
  }
  function matchedRouteBy(routeObject) {
    const routeMatched = routesList.find((route) => route.path === routeObject.path || route.path + "/" === routeObject.path || route.name === routeObject.name);
    if (routeMatched) {
      return { matched: true, path: routeMatched.path };
    }
    if (routeObject.path) {
      const hasAliases = routesList.find((route) => route.alias === routeObject.path || route.alias === routeObject.path + "/");
      if (hasAliases) {
        return { matched: true, path: hasAliases.alias };
      }
    }
    const hasNotFound = routesList.find((route) => route.notfound);
    if (hasNotFound) {
      return { matched: true, path: hasNotFound.path };
    }
    if (mambo.develop) {
      alert(`MamboRouter: ${JSON.stringify(routeObject)} route do not exist`);
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
    if (!Number.isInteger(args)) {
      if (mambo.develop) {
        alert(`MamboRouter: .go() expected a integer number`);
      }
      return;
    }
    historyManager.go(args);
  }
  function routerPush(routeObject) {
    if (isValidRouteObject(routeObject, "push")) {
      if (isCurrentRoute(routeObject)) {
        return;
      }
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
    if (self.current.hasOwnProperty("action")) {
      if (self.current.action.constructor.name === "Function") {
        self.current.action();
      } else {
        if (mambo.develop) {
          alert(`MamboRouter: action should be a function `);
        }
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
    self.current = tools.utils.extend(true, self.current, currentRouteObject);
  }
};
tools.string = function MamboString() {
  "use strict";
  const self = this;
  this.filterArray = filterArray;
  this.findInArray = findInArray;
  this.getSearchFunction = getSearchFunction;
  function filterArray(array, searchText, getItemTextFunc, filter) {
    let searchFunc = getSearchFunction(filter);
    return array.filter((item) => searchFunc(getItemTextFunc(item), searchText));
  }
  function findInArray(array, searchText, getItemTextFunc, filter) {
    let searchFunc = getSearchFunction(filter);
    return array.find((item) => searchFunc(getItemTextFunc(item), searchText));
  }
  function getSearchFunction(filter) {
    switch (filter) {
      case "contains":
        return contains;
      case "equals":
        return equals;
      default:
        return () => {
          return true;
        };
    }
  }
  function contains(itemText, searchText) {
    return itemText.toLowerCase().includes(searchText.toLowerCase());
  }
  function equals(itemText, searchText) {
    return itemText.toLowerCase() === searchText.toLowerCase();
  }
};
tools.utils = function MamboUtilities() {
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
    let extended = {};
    let deep = false;
    let i = 0;
    let length = arguments.length;
    if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
      deep = arguments[0];
      i++;
    }
    function merge(obj2) {
      for (var prop in obj2) {
        if (Object.prototype.hasOwnProperty.call(obj2, prop)) {
          if (deep && isObject(obj2[prop])) {
            extended[prop] = extend(true, extended[prop], obj2[prop]);
          } else if (deep && isArray(obj2[prop])) {
            mergeArray(obj2[prop], extended, prop);
          } else {
            extended[prop] = obj2[prop];
          }
        }
      }
    }
    function mergeArray(array, extended2, prop) {
      extended2[prop] = [];
      array.forEach((item, index) => {
        if (deep && isObject(item)) {
          extended2[prop][index] = extend(true, extended2[prop][index], item);
        } else if (deep && isArray(item)) {
          mergeArray(item, extended2[prop], index);
        } else {
          extended2[prop][index] = item;
        }
      });
    }
    for (; i < length; i++) {
      var obj = arguments[i];
      merge(obj);
    }
    return extended;
  }
  function getUniqueId(num) {
    num = num && !isNaN(num) ? num : 1e5;
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
    if (!isNumber(number))
      return "";
    return (number * 100).toFixed(decimals) + "%";
  }
};

return tools;
}
