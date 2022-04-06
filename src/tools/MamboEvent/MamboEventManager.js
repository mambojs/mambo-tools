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
 *  File : MamboEventManager.js
 *******************************************/
window['tools']['event'] = new function MamboEventManager() {

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
}

function MamboEventDirectory() {
    // Include events in this object
    this.events = {
        testEvent: "testEvent"
    };
}