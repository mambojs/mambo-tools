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
 *  File : MamboObjectManager.js
 *******************************************/
window['tools']['object'] = new function MamboObjectManager() {
    'use strict';

    // Object library
    const store = {};

    this.get = (name) => store[name];
    this.save = saveObject;
    this.remove = (name) => delete store[name];
    this.getLibrary = () => store;
    this.clearLibrary = () => {
        for (let key in store) delete store[key]
        return store;
    };

    function saveObject(object, name) {
        const objName = name ? name : object.constructor.name;
        store[objName] = object;
    }
}