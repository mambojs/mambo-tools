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
 *  File : server.js
 *******************************************/

'use strict';

// Scope variables
const express = require("express");
const app = express();
const path = require("path");
const config = require("./setup/config.cjs");
 
const DIR = config.SRC_DIR;
const PORT = config.PORT;

//setting middleware
 
app.use(`/${DIR}`, express.static(DIR));
 
// Return Index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, `${DIR}/index.html`));
});
 
app.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);
