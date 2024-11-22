const fs = require("fs");
const path = require("path");
const version = require("../package.json").version;
const documentationDir = path.join(__dirname, "../documentation");
const archivedDir = path.join(documentationDir, "archived");
const distDir = path.join(__dirname, "../dist");
const buildDir = path.join(__dirname, `../build/${version}`);
const currentFileName = path.join(documentationDir, "documentation.md");
const archivedFileName = path.join(archivedDir, `documentation-${version}.md`);
const buildFileName = path.join(buildDir, "documentation.md");
const CURRENT_YEAR = new Date().getFullYear();
const COPYRIGHT_AND_TITLE = `<!--
******************************************
*  Copyright ${CURRENT_YEAR} Alejandro Sebastian Scotti, Scotti Corp.
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
*
*  @version ${version}
******************************************
-->

# Mambo Tools - Documentation - Version ${version}

### Table of Contents
`;

if (!fs.existsSync(documentationDir)) {
	fs.mkdirSync(documentationDir);
}

if (!fs.existsSync(archivedDir)) {
	fs.mkdirSync(archivedDir, { recursive: true });
}

if (fs.existsSync(currentFileName)) {
	const documentationContent = fs.readFileSync(currentFileName, "utf-8");
	const documentationWithHeaderAndTitle = COPYRIGHT_AND_TITLE + "\n" + documentationContent;
	fs.writeFileSync(archivedFileName, documentationWithHeaderAndTitle);

	if (!fs.existsSync(buildDir)) {
		fs.mkdirSync(buildDir, { recursive: true });
	}

	fs.writeFileSync(buildFileName, documentationWithHeaderAndTitle);
} else {
	process.exit(1);
}
