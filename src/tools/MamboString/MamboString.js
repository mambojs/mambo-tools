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
 *  File : MamboString.js
 *******************************************/
tools.string = function MamboString() {
    'use strict';

    const self = this;

    this.filterArray = filterArray;
    this.findInArray = findInArray;
    this.getSearchFunction = getSearchFunction;

    function filterArray(array, searchText, getItemTextFunc, filter) {
        let searchFunc = getSearchFunction(filter);
        return array.filter(item => searchFunc(getItemTextFunc(item), searchText));
    }

    function findInArray(array, searchText, getItemTextFunc, filter) {
        let searchFunc = getSearchFunction(filter);
        return array.find(item => searchFunc(getItemTextFunc(item), searchText));
    }

    function getSearchFunction(filter) {
        switch (filter) {
            case 'contains':
                return contains;
            case 'equals':
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
}