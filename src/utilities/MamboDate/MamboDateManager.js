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

window['tools']['date'] = new class MamboDateManager {
    constructor() {
        this.m_formatTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
        this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }

    getToday(atReallyStart = false) {
        let today = new Date();
        if (atReallyStart) today.setHours(0, 0, 0, 0);
        return today;
    }

    format(date, formatText) {
        if (!this.isDate(date) || !this.isString(formatText)) {
            return "";
        }

        let tokens = formatText.match(this.m_formatTokens);
        let returnValue = "";
        tokens.forEach(token => {
            let text = "";
            switch (token) {
                case "H":
                    text = this.getHours(date, false);
                    break;
                case "HH":
                    text = this.addZero(this.getHours(date, false), 2);
                    break;
                case "h":
                    text = this.getHours(date, true);
                    break;
                case "hh":
                    text = this.addZero(this.getHours(date, true), 2);
                    break;
                case "m":
                    text = date.getMinutes();
                    break;
                case "mm":
                    text = this.addZero(date.getMinutes(), 2);
                    break;
                case "a":
                    text = this.getAMPM(date);
                    break;
                case "A":
                    text = this.getAMPM(date).toUpperCase();
                    break;
                case "D":
                    text = date.getDate();
                    break;
                case "DD":
                    text = this.addZero(date.getDate(), 2);
                    break;
                case "ddd":
                    text = this.getDayName(date.getDay()).substring(0, 3);
                    break;
                case "dddd":
                    text = this.getDayName(date.getDay());
                    break;
                case "M":
                    text = date.getMonth() + 1;
                    break;
                case "MM":
                    text = this.addZero(date.getMonth() + 1, 2);
                    break;
                case "MMM":
                    text = this.getMonthName(date.getMonth()).substring(0, 3);
                    break;
                case "MMMM":
                    text = this.getMonthName(date.getMonth());
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

    createDate(text, formatText) {
        if (!this.isString(text) || !this.isString(formatText)) {
            return null;
        }

        let index = 0;
        let values = {
            'y': 0,
            'M': 0,
            'd': 1,
            'h': 0,
            'm': 0,
            's': 0,
            'ms': 0
        };
        let tokens = formatText.match(this.m_formatTokens);
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
                    index = this.monthNames.findIndex(name => name.toUpperCase() === value.substring(0, 3).toUpperCase());
                    if (index < 0) {
                        return null;
                    }
                    toSlice = 3;
                    values['M'] = index;
                    break;
                case "MMMM":
                    index = this.monthNames.findIndex(name => name.toUpperCase() === value.substring(0, name.length).toUpperCase());
                    if (index < 0) {
                        return null;
                    }
                    toSlice = this.monthNames[index].length;
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

    getHours(date, is12Format) {
        let hours = date.getHours();
        if (is12Format) {
            hours = hours % 12;
            hours = hours ? hours : 12;
        }
        return hours;
    }

    getAMPM(date) {
        return date.getHours() >= 12 ? 'pm' : 'am';
    }

    getDayName(day) {
        return this.weekdays[day];
    }

    getMonthName(month) {
        return this.monthNames[month];
    }

    add(date, number, token) {
        if (!this.isDate(date) || !this.isNumber(number) || !this.isString(token)) {
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

        return this;
    }

    createInterval(interval, token, min, max, formatText) {
        if (!this.isNumber(interval) || !this.isString(token) || !this.isDate(min) || !this.isDate(max)) {
            return [];
        }

        const formatFunc = formatText ? (value) => {
            return this.format(value, formatText);
        } : (value) => {
            return value;
        };

        let array = [];
        let currentDate = min;

        while (this.isBefore(currentDate, max)) {
            array.push(formatFunc(currentDate));
            this.add(currentDate, interval, token);
        }

        return array;
    }

    getDate(value, formatText) {
        let text = this.isDate(value) ? this.format(value, formatText) : value;
        return this.createDate(text, formatText);
    }

    isBefore(date1, date2) {
        return date1 < date2;
    }

    isSameOrBefore(date1, date2) {
        return date1 <= date2;
    }

    isAfter(date1, date2) {
        return date1 > date2;
    }

    isSameOrAfter(date1, date2) {
        return date1 >= date2;
    }

    isSame(date1, date2) {
        return date1.getTime() === date2.getTime();
    }

    startOf(date, token) {
        if (!this.isDate(date) || !this.isString(token)) {
            return date;
        }

        switch (token) {
            case "week":
            case "w":
                this.add(date, -date.getDay(), "d");
                break;
            case "month":
            case "M":
                this.add(date, -date.getDate() + 1, "d");
                break;
            case "year":
            case "Y":
                this.startOf(date, 'M').add(date, -date.getMonth(), "M");
                break;
            case "decade":
                this.startOf(date, 'Y').add(date, -(date.getFullYear() % 10), "Y");
                break;
            case "century":
                this.startOf(date, 'decade').add(date, -(date.getFullYear() % 100), "Y");
                break;
        }

        return this;
    }

    endOf(date, token) {
        if (!this.isDate(date) || !this.isString(token)) {
            return date;
        }

        switch (token) {
            case "month":
            case "M":
                this.startOf(date, "M").add(date, 1, "M").add(date, -1, "d");
                break;
            case "year":
            case "Y":
                this.startOf(date, 'Y').add(date, 1, "Y").add(date, -1, "d");
                break;
            case "decade":
                this.startOf(date, 'decade').add(date, 10, "Y").add(date, -1, "d");
                break;
            case "century":
                this.startOf(date, 'century').add(date, 100, "Y").add(date, -1, "d");
                break;
        }

        return this;
    }

    cloneDate(date) {
        if (!this.isDate(date)) {
            return null;
        }
        return new Date(date.getTime());
    }

    addZero(value, n) {
        return ('0' + value).slice(-n);
    }

    isDate(value) {
        return value instanceof Date || Object.prototype.toString.call(value) === '[object Date]';
    }

    isString(value) {
        return typeof value === 'string' || value instanceof String || Object.prototype.toString.call(value) === '[object String]';
    }

    isNumber(value) {
        return typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]';
    }

}