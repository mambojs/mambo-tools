const config = require("./config.cjs");
const LIB_DIR = "build";
const LIB_NAME = "mambo-tools";
const LIB_VERSION = `v${dateFormat()}`;
const LIB_FILE_NAME = `${LIB_NAME}-${LIB_VERSION}`;
const LIB_FILE_NAME_MIN = `${LIB_NAME}-min-${LIB_VERSION}`;
const SRC_TOOLS = `${config.PUBLIC_DIR}/tools`;

const COPYRIGHT = `/******************************************
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

*  @author Alejandro Sebastian Scotti
*  @version ${LIB_VERSION}
*******************************************/
`;

module.exports = {
	LIB_DIR,
	LIB_NAME,
	LIB_VERSION,
	LIB_FILE_NAME,
	LIB_FILE_NAME_MIN,
	SRC_TOOLS,
	COPYRIGHT,
};

function dateFormat() {
	const date = new Date();
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear().toString().slice(-2);
	const hour = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return [month, day, year, hour, minutes].join("-");
}
