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
*  @version v08-11-22-22-00
*******************************************/

function mamboTools() { 
const tools = {};
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
      xhr.onreadystatechange = function() {
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
  function addListeners(xhr) {
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
  function getQueryString(object2) {
    let queryString = "";
    const keys = Object.keys(object2);
    for (const key of keys) {
      let newParam = encodeURIComponent(key) + "=" + encodeURIComponent(object2[key]);
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
    if (props) {
      m_config = tools.utils.extend(true, m_config, props);
    }
  }
};
tools.api = (props) => new tools.class.APIManager(props);
tools.class.DateManager = function DateManager() {
  const self = this;
  const m_formatTokens = /(\[[^[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
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
    let values = { y: 0, M: 0, d: 1, h: 0, m: 0, s: 0, ms: 0 };
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
          if (/^(am)$/gi.test(value.substring(0, 2))) {
            toSlice = 2;
            values["h"] = values["h"] === 12 ? 0 : values["h"];
          } else if (/^(pm)$/gi.test(value.substring(0, 2))) {
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
    const formatFunc = formatText ? (value) => format(value, formatText) : (value) => value;
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
tools.date = (props) => new tools.class.DateManager(props);
tools.class.EventManager = function EventManager() {
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
tools.event = (props) => new tools.class.EventManager(props);
function MamboEventDirectory() {
  this.events = {
    testEvent: "testEvent"
  };
}
tools.class.HistoryManager = function HistoryManager() {
  const popstate = new Event("popstate");
  const locationchange = new Event("locationchange");
  let path;
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
tools.class.IPFS = function IPFS() {
};
tools.ipfs = (props) => new tools.class.IPFS(props);
tools.class.ObjectManager = function ObjectManager() {
  let store = {};
  this.get = (name) => store[name];
  this.save = saveObject;
  this.remove = (name) => delete store[name];
  this.getLibrary = () => store;
  this.clearLibrary = () => store = {};
  function saveObject(object2, name) {
    const objName = name ? name : object2.constructor.name;
    store[objName] = object2;
  }
};
tools.object = (props) => new tools.class.ObjectManager(props);
tools.class.RouterManager = function RouterManager(props = {}) {
  const self = this;
  const utils = object.get("utils");
  const { historyManager } = props;
  if (!historyManager) {
    alert("RouterManager: the dependency historyManager instance is a required prop.");
    return;
  }
  window.addEventListener("locationchange", setRoute);
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
    const isValidFormat = args.every((obj) => obj.constructor.name === "Object" && "path" in obj && typeof obj.path === "string" && obj.path.trim() !== "");
    if (!isValidFormat) {
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
      const { matched, path } = matchedRouteBy({ path: location.pathname });
      if (matched)
        historyManager.setPath(path);
      return;
    }
  }
  function isCurrentRoute(routeObject) {
    if (routeObject.path === self.current.path)
      return true;
    return false;
  }
  function isValidRouteObject(args) {
    if (!routesList.length)
      return false;
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
      if (isAllKeysValid)
        return true;
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
    if (!Number.isInteger(args))
      return;
    historyManager.go(args);
  }
  function routerPush(routeObject) {
    if (isValidRouteObject(routeObject)) {
      if (isCurrentRoute(routeObject))
        return;
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
    self.current = utils.extend(true, self.current, currentRouteObject);
  }
};
tools.router = (props) => new tools.class.RouterManager(props);
tools.class.String = function String2() {
  "use strict";
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
tools.string = (props) => new tools.class.String(props);
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
  function clone(object2) {
    return extend(true, {}, object2);
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
tools.utils = (props) => new tools.class.Utilities(props);

return tools;
}
