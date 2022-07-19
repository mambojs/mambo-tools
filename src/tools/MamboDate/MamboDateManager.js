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
 *  File : MamboDateManager.js
 *******************************************/
tools.date = new function MamboDateManager() {
    'use strict';

    const self = this;
    const m_formatTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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

        tokens.forEach(token => {
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
        let values = { 'y': 0, 'M': 0, 'd': 1, 'h': 0, 'm': 0, 's': 0, 'ms': 0 };
        let tokens = formatText.match(m_formatTokens);
        let toSlice = 0;
        let value = text;

        for (let i = 0, len = tokens.length; i < len; i++) { //Used for to break the loop when there is an error in the format text
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
                    values['h'] = parseInt(value.substring(0, toSlice));
                    break;
                case "HH":
                    if (/^([0-1]\d|2[0-3])$/g.test(value.substring(0, 2))) {
                        toSlice = 2;
                    } else {
                        return null;
                    }
                    values['h'] = parseInt(value.substring(0, toSlice));
                    break;
                case "h":
                    if (/^(1[0-2])$/g.test(value.substring(0, 2))) {
                        toSlice = 2;
                    } else if (/^(\d)$/g.test(value.substring(0, 1))) {
                        toSlice = 1;
                    } else {
                        return null;
                    }
                    values['h'] = parseInt(value.substring(0, toSlice));
                    break;
                case "hh":
                    if (/^([0]\d|1[0-2])$/g.test(value.substring(0, 2))) {
                        toSlice = 2;
                    } else {
                        return null;
                    }
                    values['h'] = parseInt(value.substring(0, toSlice));
                    break;
                case "m":
                    if (/^([1-5]\d)$/g.test(value.substring(0, 2))) {
                        toSlice = 2;
                    } else if (/^(\d)$/g.test(value.substring(0, 1))) {
                        toSlice = 1;
                    } else {
                        return null;
                    }
                    values['m'] = parseInt(value.substring(0, toSlice));
                    break;
                case "mm":
                    if (/^([0-5]\d)$/g.test(value.substring(0, 2))) {
                        toSlice = 2;
                    } else {
                        return null;
                    }
                    values['m'] = parseInt(value.substring(0, toSlice));
                    break;
                case "a":
                case "A":
                    if (/^(am)$/ig.test(value.substring(0, 2))) {
                        toSlice = 2;
                        values['h'] = values['h'] === 12 ? 0 : values['h'];
                    } else if (/^(pm)$/ig.test(value.substring(0, 2))) {
                        toSlice = 2;
                        values['h'] = values['h'] < 12 ? values['h'] + 12 : values['h'];
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
                    values['d'] = parseInt(value.substring(0, toSlice));
                    break;
                case "DD":
                    if (/^(0[1-9]|[1-2]\d|3[0-1])$/g.test(value.substring(0, 2))) {
                        toSlice = 2;
                    } else {
                        return null;
                    }
                    values['d'] = parseInt(value.substring(0, toSlice));
                    break;
                case "M":
                    if (/^(1[0-2])$/g.test(value.substring(0, 2))) {
                        toSlice = 2;
                    } else if (/^([1-9])$/g.test(value.substring(0, 1))) {
                        toSlice = 1;
                    } else {
                        return null;
                    }
                    values['M'] = parseInt(value.substring(0, toSlice)) - 1;
                    break;
                case "MM":
                    if (/^(0[1-9]|1[0-2])$/g.test(value.substring(0, 2))) {
                        toSlice = 2;
                    } else {
                        return null;
                    }
                    values['M'] = parseInt(value.substring(0, toSlice)) - 1;
                    break;
                case "MMM":
                    index = monthNames.findIndex(name => name.toUpperCase() === value.substring(0, 3).toUpperCase());
                    if (index < 0) {
                        return null;
                    }
                    toSlice = 3;
                    values['M'] = index;
                    break;
                case "MMMM":
                    index = monthNames.findIndex(name => name.toUpperCase() === value.substring(0, name.length).toUpperCase());
                    if (index < 0) {
                        return null;
                    }
                    toSlice = monthNames[index].length;
                    values['M'] = index;
                    break;
                case "YY":
                    if (/^(\d{2})$/g.test(value.substring(0, 2))) {
                        toSlice = 2;
                    } else {
                        return null;
                    }
                    values['y'] = parseInt(value.substring(0, toSlice));
                    break;
                case "YYYY":
                    if (/^(\d{4})$/g.test(value.substring(0, 4))) {
                        toSlice = 4;
                    } else {
                        return null;
                    }
                    values['y'] = parseInt(value.substring(0, toSlice));
                    break;
                default:
                    toSlice = token.length;
                    break;
            }

            value = value.slice(toSlice);
        }
        return new Date(values['y'], values['M'], values['d'], values['h'], values['m'], values['s'], values['ms']);
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
        return date.getHours() >= 12 ? 'pm' : 'am';
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
                startOf(date, 'M').add(date, -date.getMonth(), "M");
                break;
            case "decade":
                startOf(date, 'Y').add(date, -(date.getFullYear() % 10), "Y");
                break;
            case "century":
                startOf(date, 'decade').add(date, -(date.getFullYear() % 100), "Y");
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
                startOf(date, 'Y').add(date, 1, "Y").add(date, -1, "d");
                break;
            case "decade":
                startOf(date, 'decade').add(date, 10, "Y").add(date, -1, "d");
                break;
            case "century":
                startOf(date, 'century').add(date, 100, "Y").add(date, -1, "d");
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
        return ('0' + value).slice(-n);
    }

    function isDate(value) {
        return value instanceof Date || Object.prototype.toString.call(value) === '[object Date]';
    }

    function isString(value) {
        return typeof value === 'string' || value instanceof String || Object.prototype.toString.call(value) === '[object String]';
    }

    function isNumber(value) {
        return typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]';
    }
}