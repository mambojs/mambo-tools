window.dom = new function DomJS() {
    "use strict";

    const self = this;

    this.append = addChild;
    this.appendSelfToParentTag = appendSelfToParentTag;
    this.appendSVG = addSVGChild;
    this.addClass = addClass;
    this.computeTagHeight = computeTagHeight;
    this.computeTagWidth = computeTagWidth;
    this.createTag = createTag;
    this.createSVGTag = createSVGTag;
    this.empty = emptyTag;
    this.getTag = getTag;
    this.getTags = getTags;
    this.hasClass = hasClass;
    this.parse = parseHTMLString;
    this.prepend = prependChild;
    this.remove = removeTag;
    this.removeAll = removeAllTags;
    this.removeAttrs = removeAttributes;
    this.removeAttrsAll = removeAttributesAll;
    this.removeClass = removeClass;
    this.removeClassAll = removeClassAll;
    this.setAttr = setAttribute;
    this.setAttrAll = setAttributeAll;
    this.setProps = setProperties;
    this.setPropsAll = setPropertiesAll;
    this.supplantHTML = supplantHTML;
    this.toggleClass = toggleClass;

    function createTag(name, config) {
        const newEl = createTagNS(name);

        if (!config || !isObject(config)) {
            return newEl;
        }

        switch (name) {
            case "input":
            case "textarea":
            case "select":
            case "option":
            case "output":
                newEl.value = config.text ? config.text : "";
                break;
            default:
                newEl.innerText = config.text ? config.text : "";
                break;
        }

        setProperties(newEl, config.prop);
        setAttribute(newEl, config.attr);
        setEvent(newEl, config.event);

        if (config.class && config.class !== "") {
            newEl.className = config.class;
        }

        return newEl;
    }

    function setEvent(tagEle, events) {
        const tag = getTag(tagEle);
        if (tag && !isString(tag) && events && isObject(events)) {
            for (const key in events) {
                tag.addEventListener(key, events[key]);
            }
        }
        return self;
    }

    function createSVGTag(name, config) {
        const newEl = createTagNS(name, "SVG");

        if (!config || !isObject(config)) return;

        setProperties(newEl, config.prop);
        setAttribute(newEl, config.attr);
        setEvent(newEl, config.event);

        if (config.children && Array.isArray(config.children)) {
            config.children.forEach(child => {
                let newChild = createSVGTag(child.name, child.props, child.attrs, child.children);
                append(newEl, newChild);
            });
        }

        return newEl;
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

    function addChild(selector, content, prepend) {
        
        if (!content || !selector) {
            console.error("DOM.addChild(): missing parameter 'selector', 'content' or both.");
            return;
        }

        // Parse content if String type
        if (typeof content === "string") {
            content = parseHTMLString(content);
        }

        if (hasSingleID(selector)) {
            selector = selector.replace("#", '');
            append(document.getElementById(selector), content, prepend);
            return self;
        }

        if (hasSingleClass(selector)) {
            const tags = document.getElementsByClassName(selector);
            if (tags && tags.length > 0) {
                appendChildAll(tags, content, prepend);
            }
            return self;
        }

        if (isString(selector)) {
            const tags = document.querySelectorAll(selector);
            if (tags && tags.length > 0) {
                appendChildAll(tags, content, prepend);
            }
            return self;
        }

        if (isElement(selector) || isNode(selector)) {
            append(selector, content, prepend);
            return self;
        }

        if (isNodeList(selector) || isHTMLCollection(selector) || isArray(selector)) {
            appendChildAll(selector, content, prepend);
            return self;
        }
    }

    function appendSelfToParentTag(parentTag, self, prepend) {
        const parentEle = getTag(parentTag);
        if (parentEle) {
            addChild(parentEle, self, prepend);
            return parentEle;
        } else {
            return `${self.localName}: parentTag element not found. DOM install failed.`;
        }
    }

    function addSVGChild(selector, content, prepend) {
        if (!content || !selector) {
            console.error("DOM.addSVGChild(): missing parameter 'selector', 'content' or both.");
            return;
        }

        // Parse content if String type
        if (typeof content === "string") {

            // Create a dummy receptacle
            let receptacle = document.createElement('div');
            // Wrap the svg string to a svg object (string)
            let svgfragment = '<svg>' + content + '</svg>';
            // Add all svg to the receptacle
            receptacle.innerHTML = '' + svgfragment;

            // Splice the childs of the SVG inside the receptacle to the SVG at the body
            Array.prototype.slice.call(receptacle.childNodes[0].childNodes).forEach(function (el) {
                addChild(selector, el, prepend);
            });
        }
        else {
            addChild(selector, el, prepend);
        }
    }

    function prependChild(selector, content) {
        addChild(selector, content, true);
    }

    function appendChildAll(list, content, prepend) {
        for (let i = 0; i < list.length; i++) {
            append(list[i], content, prepend);
        }
    }

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

    function getTag(selector, parent) {
        if (typeof selector !== "string") {
            return selector;
        }

        let parentTag = parent ? parent : document;

        if (typeof parentTag === "string") {
            parentTag = getElement(parentTag);
        }

        if (hasSingleID(selector)) {
            return parentTag.getElementById(selector.replace("#", ""));
        }

        if (hasSingleClass(selector)) {
            return parentTag.getElementsByClassName(selector.replace(".", ""))[0];
        }

        if (hasSingleTagName(selector)) {
            return parentTag.getElementsByTagName(selector)[0];
        }

        return parentTag.querySelector(selector);
    }

    function getTags(selector, parent) {
        if (typeof selector !== "string") {
            return selector;
        }

        if (hasSingleID(selector)) {
            return "For a single #id selector use getTag() method instead (expects a single tag return, not a list).";
        }

        let element = parent ? parent : document;

        if (hasSingleClass(selector)) {
            return element.getElementsByClassName(selector.replace(".", ""));
        }

        if (hasSingleTagName(selector)) {
            return element.getElementsByTagName(selector);
        }

        console.log("DOM.getTags(): you have used document.querySelectorAll('') that returns DOM tags that are not 'LIVE' therefore won't automatically stay in sync with the browser therefore, it's not recommended. Try a direct String selector.");
        return element.querySelectorAll(selector);
    }

    function removeTag(selector) {
        if (typeof selector === "string") {
            if (hasSingleID(selector)) {
                remove(getTag(selector));
            } else {
                removeAllTags(getTags(selector));
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
    }

    function removeAllTags(tagList) {
        for (let index = 0; index < tagList.length; index++) {
            removeTag(tagList[index]);
        }
    }

    function addClass(tag, cls) {
        let ele = getTag(tag);
        if (!hasClass(ele, cls)) {
            ele.classList.add(cls);
        }
        return self;
    }

    function removeClass(tag, cls) {
        let ele = getTag(tag);
        ele.classList.remove(cls);
        return self;
    }

    function removeClassAll(tags, cls) {
        if (isArray(tags)) {
            for (let index = 0; index < tags.length; index++) {
                removeClass(tags[index], cls);
            }
        } else if (isObject(tags)) {
            for (const key in tags) {
                removeClass(tags[key], cls);
            }
        }
    }

    function toggleClass(tag, cls) {
        let ele = getTag(tag);
        ele.classList.toggle(cls);
        return self;
    }

    function emptyTag(selector) {
        const tag = getTag(selector);
        tag.innerHTML = "";
        return self;
    }

    function setProperties(ele, prop) {
        const tag = getTag(ele);
        if (tag && !isString(tag) && prop && isObject(prop)) {
            for (const key in prop) {
                tag[key] = prop[key];
            }
        }
        return self;
    }

    function setPropertiesAll(ele, props) {
        const tags = getTags(ele);
        if (tags && !isString(tags) && props && isObject(props)) {
            for (let index = 0; index < tags.length; index++) {
                for (const key in props) {
                    tags[index][key] = props[key];
                }
            }
        }
        return self;
    }

    function setAttribute(tagEle, attr) {
        const tag = getTag(tagEle);
        if (tag && !isString(tag) && attr && isObject(attr)) {
            for (const key in attr) {
                tag.setAttribute(key, attr[key]);
            }
        }
        return self;
    }

    function setAttributeAll(ele, attrs) {
        const tags = getTags(ele);
        if (tags && !isString(tags) && attrs && isObject(attrs)) {
            for (let index = 0; index < tags.length; index++) {
                for (const key in attrs) {
                    tags[index].setAttribute(key, attrs[key]);
                }
            }
        }
        return self;
    }

    function removeAttributes(tagEle, attrs) {
        const tag = getTag(tagEle);
        if (tag && !isString(tag) && attrs && Array.isArray(attrs)) {
            attrs.forEach(attr => {
                tag.removeAttribute(attr);
            });
        }
        return self;
    }

    function removeAttributesAll(ele, attrs) {
        const tags = getTags(ele);
        if (tags && !isString(tags) && attrs && Array.isArray(attrs)) {
            for (let index = 0; index < tags.length; index++) {
                attrs.forEach(attr => {
                    tags[index].removeAttribute(attr);
                });
            }
        }
        return self;
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


    function hasSingleID(string) {
        if (isString(string)) {
            return string.startsWith("#") && singleHashChar(string) && !hasColon(string) && !string.includes(".") && !string.includes(" ");
        }
    }

    function hasSingleClass(string) {
        if (isString(string)) {
            return string.startsWith(".") && singlePeriodChar(string) && !hasColon(string) && !string.includes("#") && !string.includes(" ");
        }
    }

    function hasSingleTagName(string) {
        if (isString(string)) {
            return !string.includes("#") && !string.includes(".") && !string.includes(" ") && !hasColon(string);
        }
    }

    function hasColon(string) {
        if (isString(string)) {
            return string.includes(":");
        }
    }

    function singlePeriodChar(string) {
        if (isString(string)) {
            return (string.match(RegExp('\\.', 'g')) || []).length === 1;
        }
    }

    function singleHashChar(string) {
        if (isString(string)) {
            return (string.match(RegExp('#', 'g')) || []).length === 1;
        }
    }

    function isElement(element) {
        return element instanceof Element;
    }

    function isNode(node) {
        return node instanceof Node;
    }

    function isNodeList(nodeList) {
        return NodeList.prototype.isPrototypeOf(nodeList);
    }

    function isHTMLCollection(htmlCollection) {
        return HTMLCollection.prototype.isPrototypeOf(htmlCollection);
    }

    function isArray(array) {
        return Array.isArray(array);
    }

    function isString(value) {
        return typeof value === "string";
    }

    function isObject(value) {
        return typeof value === "object";
    }

    function hasClass(target, className) {
        return target.className.indexOf(className) !== -1;
    }

    function parseHTMLString(stringHTML) {
        var template = document.createElement('template');
        stringHTML = stringHTML.trim();
        template.innerHTML = stringHTML;
        return template.content;
    }

    function supplantHTML(html, data) {
        return html.replace(/{([^{}]*)}/g,
            function (a, b) {
                let r = getProperty(b, data);
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
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

    function getPropertyValue(object, property) {
        if (object && typeof object === 'object') {

        }
    }

    function computeTagWidth(tag, parentTag) {
        const style = window.getComputedStyle(tag, null);

        if (!style) {
            return;
        }

        const leftPad = style.getPropertyValue("padding-left");
        const rightPad = style.getPropertyValue("padding-right");
        const leftMargin = style.getPropertyValue("margin-left");
        const rightMargin = style.getPropertyValue("margin-right");
        const sumPad = getStyleNumValue(leftPad) + getStyleNumValue(rightPad);
        const sumMargin = getStyleNumValue(leftMargin) + getStyleNumValue(rightMargin);
        let result = 0;

        if (parentTag) {
            const style = window.getComputedStyle(parentTag, null);
            if (style) {
                const leftPad = style.getPropertyValue("padding-left");
                const rightPad = style.getPropertyValue("padding-right");
                const sumPad = getStyleNumValue(leftPad) + getStyleNumValue(rightPad);
                result += sumPad + sumMargin;
            }
        }

        result += sumPad + sumMargin + tag.clientWidth;
        return result;
    }

    function computeTagHeight(tag) {
        const style = window.getComputedStyle(tag, null);

        if (!style) {
            return;
        }

        const topPad = style.getPropertyValue("padding-top");
        const bottomPad = style.getPropertyValue("padding-bottom");
        const topMargin = style.getPropertyValue("margin-top");
        const bottomMargin = style.getPropertyValue("margin-bottom");
        const sumPad = getStyleNumValue(topPad) + getStyleNumValue(bottomPad);
        const sumMargin = getStyleNumValue(topMargin) + getStyleNumValue(bottomMargin);
        return sumPad + sumMargin + tag.clientHeight;
    }

    function getStyleNumValue(style) {
        return parseInt(style.replace("px", ""));
    }
}
