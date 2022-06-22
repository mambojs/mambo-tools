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
 *  File : MamboRouterManager.js
 *******************************************/

window.tools.router = new function MamboRouterManager () {

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

        if (args.constructor.name === 'Array' && args.length) {

            if (!checkRoutesFormat(args)) {
                return;
            }

            if (!checkRoutesDuplicated(args)) {
                return;
            }
            
            args.forEach(route => {

                if (route.constructor.name === 'Object') {

                    let routeExist = false;

                    routesList.forEach(r => {
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

        const uniqueByName = [...new Map(args.map(item => [item['name'], item])).values()];
        const uniqueByPath = [...new Map(args.map(item => [item['path'], item])).values()];

        if (uniqueByName.length < args.length || uniqueByPath.length < args.length) {

            if (mambo.develop) alert(`MamboRouter: .routes() no duplicate name or path parameter in route object`);

            return false;

        }

        return true;

    }
    
    function checkRoutesFormat(args) {

        const isValidFormat = args.every(obj =>
            obj.constructor.name === 'Object'
            && 'path' in obj
            && typeof obj.path === 'string'
            && obj.path.trim() !== ''
        );

        if (!isValidFormat) {

            if (mambo.develop) {
                alert(`MamboRouter: .routes() expected an object with valid path`);
            }

            return false;

        }

        return true;

    }

    function getSetRoutes(args) {

        // Get

        if (!args) {
            return routesList;
        }

        // Set
        // Check objects format, Check duplicated name or path, Add routes to list, Init router/history
        
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
            
            routesList = args.concat(routesList)

            if (!historyManager) {
                init();
            }

            return;

        }

        // Developer mode

        if (mambo.develop) {
            alert(`MamboRouter: .routes() expected an Array object`);
        }

    }

    function init() {

        const { matched, path } = matchedRouteBy({ path: location.pathname });

        if (matched) {
            historyManager = new tools.history(path);
        }
        else 
        {
            if (mambo.develop) alert(`MamboRouter: No initial route matched`);
        }
    }

    function isCurrentRoute(routeObject) {
            
        if (routeObject.path === self.current.path) {
            return true;
        }

        return false;

    }

    function isValidRouteObject(args, type) {

        // Check if .rutes() is empty, Check if args is Object

        if (!routesList.length) {

            if (mambo.develop) {
                alert(`MamboRouter: .routes() is empty. Please, set a route`);
            }

            return false;
        }

        if (args && args.constructor.name === 'Object') {

            // Allow path/name/params/query/hash, Only strings & object values

            const allowedKeysList = [
                { name: 'path', type: 'String' },
                { name: 'name', type: 'String' },
                { name: 'params', type: 'Object' },
                { name: 'query', type: 'String' },
                { name: 'hash', type: 'String' }
            ];
            let wrongKeysValues = [];

            const isAllKeysValid = Object.entries(args)
                .every(arr => {
                    let allowed = allowedKeysList.filter(obj =>
                        obj.name === arr[0] && obj.type === arr[1].constructor.name);

                    if (!allowed.length) {
                        wrongKeysValues.push(arr);
                    }

                    return allowed.length > 0;
                }
                );

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
        
        const routeMatched = routesList.find(route =>
            route.path === routeObject.path
            || route.path + '/' === routeObject.path
            || route.name === routeObject.name
        );
        
        if (routeMatched) {
            return { matched: true, path: routeMatched.path };
        }

        if (routeObject.path) {
            const hasAliases = routesList.find(route =>
                route.alias === routeObject.path || route.alias === routeObject.path + '/');

            if (hasAliases) {
                return { matched: true, path: hasAliases.alias };
            }
        }

        const hasNotFound = routesList.find(route => route.notfound);

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

        if (isValidRouteObject(routeObject, 'push')) {

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

        const currentRouteObject = routesList.find(route => route.path === history.state || route.alias === history.state);

        updateCurrent(currentRouteObject);

        runAction();

    }

    function updateCurrent(currentRouteObject, recicle) {

        if (recicle) {
            self.current = current;
        }

        self.current = tools.utils.extend(true, self.current, currentRouteObject);

    }

}
