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
 *  File : MamboHistoryManager.js
 *******************************************/
window.tools.history = function MamboHistoryManager(path) {
    "use strict";

    // Public methods
    this.clearState = clearState;
    this.pushState = pushState;
    this.replaceState = replaceState;
    this.go = goToState;
    this.back = backState;
    this.forward = forwardState;

    const popstate = new Event("popstate");
    const locationchange = new Event("locationchange");

    let self = this

    setupEventHandler();
    checkHistory(); 

    function pushState(state, title, path) {
        setPageTitle(title);
        history.pushState(state, title, path);
        window.dispatchEvent(popstate)
    }

    function clearState(state, title) {
        setPageTitle(title);
        history.replaceState({ path: "/" }, title, "/");
        window.dispatchEvent(popstate)
    }

    function replaceState(state, title, path) {
        setPageTitle(title);
        history.replaceState(state, title, path);
        window.dispatchEvent(popstate)
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
            window.dispatchEvent(locationchange)
        });
    }

    function checkHistory() {
        if (history.state === null) {
            replaceState( path, "", path )
        } else {
            window.dispatchEvent(locationchange)
        }
    }

}