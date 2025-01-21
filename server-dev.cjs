// Scope variables
const express = require("express");
const app = express();
const path = require("path");
const config = require("./setup/config.cjs");
const fs = require("fs");
// path bars by platform
const separator = process.platform === "win32" ? "\\" : "/";

// Setting Middleware

// This is CORS-enabled for all origins!
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Serves resources from public folder
config.PUBLIC_DIRS_DEV.forEach((dir) => {
	app.use(express.static(path.join(__dirname, `${dir}`)));
});

// Return system configuration
app.get("/getSystemConfig", (req, res) => {
	res.send(config.system);
});

app.get("/getFile", (req, res) => {
	const s = separator;
	const { type, name, path } = req.query;

	const normalizedName = name ? name.replaceAll(" ", "") : "";
	const formattedName = normalizedName ? `${normalizedName[0].toLowerCase()}${normalizedName.slice(1)}` : "";

	const basePaths = {
		default: `${__dirname}${s}${path}`,
		script: `${__dirname}${s}src${s}tools${s}${s}${normalizedName}${s}${formattedName}.js`,
		story: `${__dirname}${s}src${s}tools${s}${s}${normalizedName}${s}storyboard${s}${formattedName}.js`,
		documentation: `${__dirname}${s}documentation${s}documentation.md`,
	};

	const myPath = basePaths[type] || basePaths.default;

	fs.readFile(myPath, "utf8", (err, file) => {
		if (err) return res.status(500).send({ error: "File not found or cannot be read." });
		res.send(file);
	});
});

// Return Index.html
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, config.OUTPUT_HTML_DEV));
});

// Start up Application
app.listen(config.PORT);
console.log(`Listening on http://localhost:${config.PORT}`);
