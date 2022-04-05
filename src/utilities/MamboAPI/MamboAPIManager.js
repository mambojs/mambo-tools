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
 *  File : MamboAPIManager.js
 *******************************************/
window['tools']['api'] = new function MamboAPIManager(options) {
    'use strict';

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
        //const url = `http://localhost:8000/getFile?path=${filePath}`;
        const url = "http://localhost:8000/getFile?";
        const options = {
            data: {
                path: filePath
            }
        };
        return execRequest("GET", url, options);
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

        return new Promise(((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            addListeners(xhr);

            xhr.onreadystatechange = function (aEvt) {
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
        }));
    }

    function configureRequest(xhr, options) {
        if (options.contentType) {
            xhr.setRequestHeader('Content-type', options.contentType);
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
        if (mambo.utils.isObject(data)) {
            return getQueryString(data);
        } else {
            return data;
        }
    }

    function setQueryString(url, data) {
        let urlParts = url.split('?');
        let baseURL = urlParts[0];
        let params = urlParts.length > 1 ? '?' + urlParts[1] : '';
        let separator = urlParts.length > 1 ? '&' : '?';
        let queryString = processData(data);

        if (queryString !== null) {
            params += separator + queryString;
        }

        return baseURL + params;
    }

    function addListeners(xhr) {
        // If not events, return
        if (!options || !options.events) {
            return;
        }

        let event = options.events.loadstart;
        if (event && typeof event === "function") {
            xhr.addEventListener('loadstart', event);
        }

        event = options.events.load;
        if (event && typeof event === "function") {
            xhr.addEventListener('load', event);
        }

        event = options.events.loadend;
        if (event && typeof event === "function") {
            xhr.addEventListener('loadend', event);
        }

        event = options.events.progress;
        if (event && typeof event === "function") {
            xhr.addEventListener('progress', event);
        }

        event = options.events.error;
        if (event && typeof event === "function") {
            xhr.addEventListener('error', event);
        }

        event = options.events.abort;
        if (event && typeof event === "function") {
            xhr.addEventListener('abort', event);
        }
    }

    function getQueryString(object) {
        let queryString = '';

        const keys = Object.keys(object);
        for (const key of keys) {
            let newParam = encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);

            if (queryString === '') {
                queryString += newParam;
            } else {
                queryString += '&' + newParam;
            }
        }

        return queryString === '' ? null : queryString;
    }

    function configure() {
        m_config = {
            responseType: "",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            crossOrigin: false,
            data: null
        };

        // If options provided, override default config
        if (options) {
            m_config = mambo.utils.extend(true, m_config, options);
        }
    }

}