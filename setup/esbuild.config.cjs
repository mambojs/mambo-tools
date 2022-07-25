
const fs = require('fs');
const { exec } = require("child_process");
const esbuild = require("esbuild");
const config = require("./config.cjs");

function buildLib() {

  const libVersion = config.LIB_VERSION;

  console.log("Building library...");

  // Uncompressed
  const optionsUncompressed = {
    stdin: { contents: '' },
    banner: { js: config.COPYRIGHT },
    inject: getLibFiles(),
    entryNames: config.LIB_FILE_NAME,
    outdir: `${config.LIB_DIR}/${libVersion}/${config.LIB_UNCOMPRESSED}`
  };
  // Bundle Native
  const optionsBundle = {
    ...optionsUncompressed,
    outdir: `${config.LIB_DIR}/${libVersion}/${config.LIB_BUNDLE}`,
    bundle: true
  };
  // Minified bundle
  const optionsMinify = {
    ...optionsBundle,
    entryNames: config.LIB_FILE_NAME_MIN,
    outdir: `${config.LIB_DIR}/${libVersion}/${config.LIB_MIN}`,
    minify: true
  };
  // Minified bundle with sourcemap
  const optionsMinifyMap = {
    ...optionsMinify,
    outdir: `${config.LIB_DIR}/${libVersion}/${config.LIB_MAP}`,
    sourcemap: true
  }

  const optionsCssThemes = {
    entryPoints: ['src/themes/dark.css'],
    outdir: `${config.LIB_DIR}/themes`,
    minify: true,
    bundle: true,
    sourcemap: true
  };

  esbuild.build(optionsUncompressed).then(result => {
    console.log("Uncompressed JS Lib: Build complete!");
  });

  esbuild.build(optionsBundle).then(result => {
    console.log("Bundle JS Lib: Build complete!");
  });

  esbuild.build(optionsMinify).then(result => {
    console.log("JS Lib Minify: Build complete!");
  });

  esbuild.build(optionsMinifyMap).then(result => {
    console.log("JS Lib Minify mapped: Build complete!");
  });

  esbuild.build(optionsCssThemes).then(result => {
    console.log("Css Themes: Build complete!");
  });

}

function getLibFiles() {
  const arrFiles = [
    `${config.SRC_DIR}/configs/mamboInit.js`
  ];
  const files = fs.readdirSync(`${config.SRC_DIR}/tools`); 
  files.forEach(file => {
    let component = `${config.SRC_DIR}/tools/${file}`;
    let componentName = file;
    if (fs.lstatSync(component).isDirectory() && !file.startsWith('_')) {
      let componentFiles = fs.readdirSync(component);
      componentFiles.forEach(filejs => {
        if (filejs.endsWith(".js")) {
          const filepath = `${config.SRC_DIR}/tools/${componentName}/${filejs}`;
          arrFiles.push(filepath);
        }
      });
    }
  });
  console.log(arrFiles);
  return arrFiles;
}

for (var i=0; i<process.argv.length;i++) {
  switch (process.argv[i]) {
    case 'buildLib':
      buildLib();
      break;
  }
}

module.exports.buildLib = buildLib;