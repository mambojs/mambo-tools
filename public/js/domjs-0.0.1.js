/******************************************
*  Copyright 2024 Alejandro Sebastian Scotti, Scotti Corp.
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
*  @version 0.0.1
*******************************************/

function domJS() { 
const dom = {};
dom.addClass = (tag, cls) => {
  let ele = dom.getTag(tag);
  if (!dom.hasClass(ele, cls)) {
    ele.classList.add(cls);
  }
  return dom;
};
dom.append = (selector, content, prepend) => {
  const utils = dom.utils;
  if (!content || !selector) {
    console.error("DOM.addChild(): missing parameter --> ", selector, content);
    return;
  }
  if (typeof content === "string") {
    content = dom.parse(content);
  }
  if (utils.hasSingleID(selector)) {
    selector = selector.replace("#", "");
    utils.append(document.getElementById(selector), content, prepend);
    return dom;
  }
  if (utils.hasSingleClass(selector)) {
    const tags = document.getElementsByClassName(selector);
    if (tags && tags.length > 0) {
      utils.appendChildAll(tags, content, prepend);
    }
    return dom;
  }
  if (utils.isString(selector)) {
    const tags = document.querySelectorAll(selector);
    if (tags && tags.length > 0) {
      utils.appendChildAll(tags, content, prepend);
    }
    return dom;
  }
  if (utils.isElement(selector) || utils.isNode(selector)) {
    utils.append(selector, content, prepend);
    return dom;
  }
  if (utils.isNodeList(selector) || utils.isHTMLCollection(selector) || utils.isArray(selector)) {
    utils.appendChildAll(selector, content, prepend);
    return dom;
  }
};
dom.appendSVG = (selector, content, prepend) => {
  if (!content || !selector) {
    console.error("DOM.addSVGChild(): missing parameter 'selector', 'content' or both.");
    return;
  }
  if (typeof content === "string") {
    let receptacle = document.createElement("div");
    let svgfragment = "<svg>" + content + "</svg>";
    receptacle.innerHTML = "" + svgfragment;
    Array.prototype.slice.call(receptacle.childNodes[0].childNodes).forEach(function(el) {
      dom.append(selector, el, prepend);
    });
  } else {
    dom.append(selector, content, prepend);
  }
};
dom.computeTagHeight = (tag) => {
  return new Promise((resolve) => {
    const utils = dom.utils;
    const style = window.getComputedStyle(tag, null);
    if (!style) {
      resolve();
      return;
    }
    const topPad = style.getPropertyValue("padding-top");
    const bottomPad = style.getPropertyValue("padding-bottom");
    const topMargin = style.getPropertyValue("margin-top");
    const bottomMargin = style.getPropertyValue("margin-bottom");
    const sumPad = utils.getStyleNumValue(topPad) + utils.getStyleNumValue(bottomPad);
    const sumMargin = utils.getStyleNumValue(topMargin) + utils.getStyleNumValue(bottomMargin);
    resolve(sumPad + sumMargin + tag.clientHeight);
  });
};
dom.computeTagWidth = (tag, parentTag) => {
  return new Promise((resolve) => {
    const utils = dom.utils;
    const style = window.getComputedStyle(tag, null);
    if (!style) {
      resolve();
      return;
    }
    const leftPad = style.getPropertyValue("padding-left");
    const rightPad = style.getPropertyValue("padding-right");
    const leftMargin = style.getPropertyValue("margin-left");
    const rightMargin = style.getPropertyValue("margin-right");
    const sumPad = utils.getStyleNumValue(leftPad) + utils.getStyleNumValue(rightPad);
    const sumMargin = utils.getStyleNumValue(leftMargin) + utils.getStyleNumValue(rightMargin);
    let result = 0;
    if (parentTag) {
      const style2 = window.getComputedStyle(parentTag, null);
      if (style2) {
        const leftPad2 = style2.getPropertyValue("padding-left");
        const rightPad2 = style2.getPropertyValue("padding-right");
        const sumPad2 = utils.getStyleNumValue(leftPad2) + utils.getStyleNumValue(rightPad2);
        result += sumPad2 + sumMargin;
      }
    }
    result += sumPad + sumMargin + tag.clientWidth;
    resolve(result);
  });
};
dom.content = (selector, content, prepend) => {
  const self2 = dom;
  const utils = self2.utils;
  if (!content || !selector) {
    console.error("DOM.addChild(): missing parameter 'selector', 'content' or both.");
    return;
  }
  selector = dom.getTag(selector);
  if (typeof content === "string") {
    content = self2.parse(content);
  }
  if (utils.hasSingleID(selector)) {
    selector = selector.replace("#", "");
    utils.append(document.getElementById(selector), content, prepend);
    return self2;
  }
  if (utils.hasSingleClass(selector)) {
    const tags = document.getElementsByClassName(selector);
    if (tags && tags.length > 0) {
      utils.appendChildAll(tags, content, prepend);
    }
    return self2;
  }
  if (utils.isString(selector)) {
    const tags = document.querySelectorAll(selector);
    if (tags && tags.length > 0) {
      utils.appendChildAll(tags, content, prepend);
    }
    return self2;
  }
  if (utils.isElement(selector) || utils.isNode(selector)) {
    utils.append(selector, content, prepend);
    return self2;
  }
  if (utils.isNodeList(selector) || utils.isHTMLCollection(selector) || utils.isArray(selector)) {
    utils.appendChildAll(selector, content, prepend);
    return self2;
  }
};
dom.createSVGTag = (name, config) => {
  const utils = dom.utils;
  const newEl = utils.createTagNS(name, "SVG");
  if (!config || !utils.isObject(config))
    return;
  dom.setProps(newEl, config.prop);
  dom.setAttr(newEl, config.attr);
  utils.setEvent(newEl, config.event);
  if (config.children && Array.isArray(config.children)) {
    config.children.forEach((child) => {
      let newChild = dom.createSVGTag(child.name, child.props, child.attrs, child.children);
      utils.append(newEl, newChild);
    });
  }
  return newEl;
};
dom.createTag = (nameOrConfig, config) => {
  const utils = dom.utils;
  let m_props;
  if (!nameOrConfig || nameOrConfig === "") {
    console.error("createTag() 'required first argument is missing a value. Second argument --> ", config);
    return;
  }
  if (utils.isObject(nameOrConfig)) {
    if (!nameOrConfig.name) {
      console.error("createTag() 'object is missing the key 'name' with string value tag name. Object --> ", nameOrConfig);
      return;
    }
    if (!utils.isString(nameOrConfig.name) || nameOrConfig.name === "") {
      console.error("createTag() 'object key 'name' must be string value tag name. Object --> ", nameOrConfig);
      return;
    }
    m_props = { ...nameOrConfig };
  } else {
    m_props = { ...config };
    m_props.name = nameOrConfig;
  }
  const newEl = utils.createTagNS(m_props.name);
  switch (m_props.name) {
    case "input":
    case "textarea":
    case "select":
    case "option":
    case "output":
      newEl.value = m_props.text ? m_props.text : "";
      break;
    default:
      newEl.innerText = m_props.text ? m_props.text : "";
      break;
  }
  dom.setProps(newEl, m_props.prop);
  dom.setAttr(newEl, m_props.attr);
  utils.setEvent(newEl, m_props.event);
  if (m_props.class && m_props.class !== "") {
    newEl.className = m_props.class;
  }
  return newEl;
};
dom.empty = (selector) => {
  const tag = dom.getTag(selector);
  tag.innerHTML = "";
  return self;
};
dom.getTag = (selector, parent) => {
  const utils = dom.utils;
  if (typeof selector !== "string") {
    return selector;
  }
  let parentTag = parent ? parent : document;
  if (typeof parentTag === "string") {
    parentTag = utils.getElement(parentTag);
  }
  if (utils.hasSingleID(selector)) {
    return parentTag.getElementById(selector.replace("#", ""));
  }
  if (utils.hasSingleClass(selector)) {
    return parentTag.getElementsByClassName(selector.replace(".", ""))[0];
  }
  if (utils.hasSingleTagName(selector)) {
    return parentTag.getElementsByTagName(selector)[0];
  }
  return parentTag.querySelector(selector);
};
dom.getTags = (selector, parent) => {
  const utils = dom.utils;
  if (typeof selector !== "string") {
    return selector;
  }
  if (utils.hasSingleID(selector)) {
    return "For a single #id selector use getTag() method instead (expects a single tag return, not a list).";
  }
  let element = parent ? parent : document;
  if (utils.hasSingleClass(selector)) {
    return element.getElementsByClassName(selector.replace(".", ""));
  }
  if (utils.hasSingleTagName(selector)) {
    return element.getElementsByTagName(selector);
  }
  console.log("DOM.getTags(): you have used document.querySelectorAll('') that returns DOM tags that are not 'LIVE' therefore won't automatically stay in sync with the browser therefore, it's not recommended. Try a direct String selector.");
  return element.querySelectorAll(selector);
};
dom.hasClass = (target, className) => {
  return target.className.indexOf(className) !== -1;
};
dom.parse = (stringHTML) => {
  var template = document.createElement("template");
  stringHTML = stringHTML.trim();
  template.innerHTML = stringHTML;
  return template.content;
};
dom.prepend = (selector, content) => {
  dom.append(selector, content, true);
};
dom.remove = (selector) => {
  const utils = dom.utils;
  if (typeof selector === "string") {
    if (utils.hasSingleID(selector)) {
      remove(dom.getTag(selector));
    } else {
      dom.removeAll(dom.getTags(selector));
    }
  } else {
    remove(selector);
  }
  return self;
  function remove(ele) {
    if (ele.parentNode.removeChild) {
      ele.parentNode.removeChild(ele);
    }
  }
};
dom.removeAll = (tagList) => {
  for (let index = 0; index < tagList.length; index++) {
    dom.remove(tagList[index]);
  }
};
dom.removeAttrs = (tagEle, attrs) => {
  const utils = dom.utils;
  const tag = dom.getTag(tagEle);
  if (tag && !utils.isString(tag) && attrs && Array.isArray(attrs)) {
    attrs.forEach((attr) => {
      tag.removeAttribute(attr);
    });
  }
  return dom;
};
dom.removeAttrsAll = (ele, attrs) => {
  const utils = dom.utils;
  const tags = dom.getTags(ele);
  if (tags && !utils.isString(tags) && attrs && Array.isArray(attrs)) {
    for (let index = 0; index < tags.length; index++) {
      attrs.forEach((attr) => {
        tags[index].removeAttribute(attr);
      });
    }
  }
  return dom;
};
dom.removeClass = (tag, cls) => {
  let ele = dom.getTag(tag);
  ele.classList.remove(cls);
  return dom;
};
dom.removeClassAll = (tags, cls) => {
  const utils = dom.utils;
  if (utils.isArray(tags)) {
    for (let index = 0; index < tags.length; index++) {
      dom.removeClass(tags[index], cls);
    }
  } else if (utils.isObject(tags)) {
    for (const key in tags) {
      dom.removeClass(tags[key], cls);
    }
  }
};
dom.setAttr = (tagEle, attr) => {
  const utils = dom.utils;
  const tag = dom.getTag(tagEle);
  if (tag && !utils.isString(tag) && attr && utils.isObject(attr)) {
    for (const key in attr) {
      tag.setAttribute(key, attr[key]);
    }
  }
  return dom;
};
dom.setAttrAll = (ele, attrs) => {
  const utils = dom.utils;
  const tags = dom.getTags(ele);
  if (tags && !utils.isString(tags) && attrs && utils.isObject(attrs)) {
    for (let index = 0; index < tags.length; index++) {
      for (const key in attrs) {
        tags[index].setAttribute(key, attrs[key]);
      }
    }
  }
  return dom;
};
dom.setProps = (ele, prop) => {
  const utils = dom.utils;
  const tag = dom.getTag(ele);
  if (tag && !utils.isString(tag) && prop && utils.isObject(prop)) {
    for (const key in prop) {
      tag[key] = prop[key];
    }
  }
  return dom;
};
dom.setPropsAll = (ele, props) => {
  const utils = dom.utils;
  const tags = dom.getTags(ele);
  if (tags && !utils.isString(tags) && props && utils.isObject(props)) {
    for (let index = 0; index < tags.length; index++) {
      for (const key in props) {
        tags[index][key] = props[key];
      }
    }
  }
  return dom;
};
dom.supplantHTML = (html, data) => {
  return html.replace(/{([^{}]*)}/g, function(a, b) {
    let r = dom.utils.getProperty(b, data);
    return typeof r === "string" || typeof r === "number" ? r : a;
  });
};
dom.toggleClass = (tag, cls) => {
  let ele = dom.getTag(tag);
  ele.classList.toggle(cls);
  return dom;
};
dom.utils = new function() {
  "use strict";
  this.append = append;
  this.appendChildAll = appendChildAll;
  this.createTagNS = createTagNS;
  this.getElement = getElement;
  this.getProperty = getProperty;
  this.getStyleNumValue = getStyleNumValue;
  this.hasColon = hasColon;
  this.hasSingleClass = hasSingleClass;
  this.hasSingleID = hasSingleID;
  this.hasSingleTagName = hasSingleTagName;
  this.isArray = isArray;
  this.isElement = isElement;
  this.isHTMLCollection = isHTMLCollection;
  this.isNode = isNode;
  this.isNodeList = isNodeList;
  this.isObject = isObject;
  this.isString = isString;
  this.setEvent = setEvent;
  this.singleHashChar = singleHashChar;
  this.singlePeriodChar = singlePeriodChar;
  function append(parent, content, prepend) {
    if (content && parent) {
      if (prepend) {
        if (!parent.firstChild) {
          parent.appendChild(content);
        } else {
          parent.insertBefore(content, parent.firstChild);
        }
      } else {
        parent.appendChild(content);
      }
    }
  }
  function appendChildAll(list, content, prepend) {
    for (let i = 0; i < list.length; i++) {
      append(list[i], content, prepend);
    }
  }
  function createTagNS(name, namespace) {
    switch (namespace) {
      case "SVG":
        return document.createElementNS("http://www.w3.org/2000/svg", name);
      case "MathML":
        return document.createElementNS("http://www.w3.org/1998/Math/MathML", name);
      default:
        return document.createElementNS("http://www.w3.org/1999/xhtml", name);
    }
  }
  function getElement(selector) {
    if (typeof selector !== "string") {
      return selector;
    }
    if (hasSingleID(selector)) {
      return document.getElementById(selector.replace("#", ""));
    }
    if (hasSingleClass(selector)) {
      return document.getElementsByClassName(selector.replace(".", ""))[0];
    }
    if (hasSingleTagName(selector)) {
      return document.getElementsByTagName(selector)[0];
    }
    return document.querySelector(selector);
  }
  function getProperty(propertyName, object) {
    let parts = propertyName.split(".");
    let property = object;
    for (let i = 0, length = parts.length; i < length; i++) {
      if (parts[i] in property === false) {
        return "";
      }
      property = property[parts[i]];
    }
    return property;
  }
  function getStyleNumValue(style) {
    return parseInt(style.replace("px", ""));
  }
  function hasColon(string) {
    if (isString(string)) {
      return string.includes(":");
    }
  }
  function hasSingleClass(string) {
    if (isString(string)) {
      return string.startsWith(".") && singlePeriodChar(string) && !hasColon(string) && !string.includes("#") && !string.includes(" ");
    }
  }
  function hasSingleID(string) {
    if (isString(string)) {
      return string.startsWith("#") && singleHashChar(string) && !hasColon(string) && !string.includes(".") && !string.includes(" ");
    }
  }
  function hasSingleTagName(string) {
    if (isString(string)) {
      return !string.includes("#") && !string.includes(".") && !string.includes(" ") && !hasColon(string);
    }
  }
  function isArray(array) {
    return Array.isArray(array);
  }
  function isElement(element) {
    return element instanceof Element;
  }
  function isHTMLCollection(htmlCollection) {
    return Object.prototype.isPrototypeOf.call(htmlCollection, HTMLCollection);
  }
  function isNode(node) {
    return node instanceof Node;
  }
  function isNodeList(nodeList) {
    return Object.prototype.isPrototypeOf.call(nodeList, NodeList);
  }
  function isObject(value) {
    return typeof value === "object";
  }
  function isString(value) {
    return typeof value === "string";
  }
  function setEvent(tagEle, events) {
    const tag = dom.getTag(tagEle);
    if (tag && !isString(tag) && events && isObject(events)) {
      for (const key in events) {
        tag.addEventListener(key, events[key]);
      }
    }
    return self;
  }
  function singleHashChar(string) {
    if (isString(string)) {
      return (string.match(RegExp("#", "g")) || []).length === 1;
    }
  }
  function singlePeriodChar(string) {
    if (isString(string)) {
      return (string.match(RegExp("\\.", "g")) || []).length === 1;
    }
  }
}();

return dom;
}
