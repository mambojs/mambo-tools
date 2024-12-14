const fs = require("fs");
const esbuild = require("esbuild");
const config = require("./esconfig.cjs");
const path = require("path");

function buildLib() {
	const libVersion = config.LIB_VERSION;

	console.log("Building library...");

	const headerFn = "\nfunction mamboTools() { \nconst tools = {class:{}};";
	const footerFn = "\nreturn tools;\n}";

	const { arrFiles, arrFilesStories } = getLibFiles();

	// Bundle Native
	const optionsBundle = {
		stdin: { contents: "" },
		banner: { js: config.COPYRIGHT + headerFn },
		footer: { js: footerFn },
		inject: arrFiles,
		entryNames: config.LIB_FILE_NAME,
		outdir: `${config.LIB_DIR}/${libVersion}`,
	};
	// Minified bundle with sourcemap
	const optionsMinifyMap = {
		...optionsBundle,
		banner: { js: config.COPYRIGHT + headerFn.replace(/\r?\n|\r/g, "") },
		footer: { js: footerFn.replace(/\r?\n|\r/g, "") },
		entryNames: config.LIB_FILE_NAME_MIN,
		outdir: `${config.LIB_DIR}/${libVersion}`,
		minify: true,
		sourcemap: true,
	};

	esbuild.build(optionsBundle).then(() => {
		console.log("Bundle JS Lib: Build complete!");
	});

	esbuild.build(optionsMinifyMap).then(() => {
		console.log("JS Lib Minify mapped: Build complete!");
		copyFiles();
	});

	const getStoriesContent = (arrFilesStories) => {
		return arrFilesStories
			.map((file) => {
				const content = fs.readFileSync(file, "utf8");

				return content;
			})
			.join("\n");
	};

	const optionsBundleStories = {
		stdin: {
			contents: getStoriesContent(arrFilesStories),
		},
		entryNames: config.STORIES_FILE_NAME,
		outdir: `${config.PUBLIC_DIR}/js`,
	};

	esbuild.build(optionsBundleStories).then(() => {
		console.log("Stories: Build complete!");
	});
}

function copyFilesToPublic(srcDir, fileName, destDir) {
	const srcPath = path.join(srcDir, fileName);
	const destPath = path.join(destDir, fileName);
	fs.copyFileSync(srcPath, destPath);
}

function copyFiles() {
	const libVersion = config.LIB_VERSION;
	const libDir = `${config.LIB_DIR}/${libVersion}`;
	copyFilesToPublic(libDir, `${config.LIB_FILE_NAME}.js`, `${config.PUBLIC_DIR}/js`);
}

function getLibFiles() {
	const arrFiles = [];
	const arrFilesStories = [];

	function processDirectory(directory) {
		const files = fs.readdirSync(directory);
		files.forEach((file) => {
			const fullPath = `${directory}/${file}`;

			if (fs.lstatSync(fullPath).isDirectory() && !file.startsWith("_")) {
				if (file === "storyboard") {
					const storyFiles = fs.readdirSync(fullPath).filter((f) => f.endsWith(".js"));
					storyFiles.forEach((storyFile) => {
						arrFilesStories.push(`${fullPath}/${storyFile}`);
					});
				} else {
					processDirectory(fullPath);
				}
			} else if (file.endsWith(".js")) {
				arrFiles.push(fullPath);
			}
		});
	}

	processDirectory(config.SRC_TOOLS);

	console.log("Main Files:", arrFiles);
	console.log("Story Files:", arrFilesStories);

	return { arrFiles, arrFilesStories };
}

for (var i = 0; i < process.argv.length; i++) {
	switch (process.argv[i]) {
		case "buildLib":
			buildLib();
			break;
	}
}

module.exports.buildLib = buildLib;
