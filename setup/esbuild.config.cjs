
const fs = require('fs');
const esbuild = require("esbuild");
const config = require("./config.cjs");

function buildLib() {

  const libVersion = config.LIB_VERSION;

  console.log("Building library...");

  const headerFn = `\nfunction MamboTools() { \nconst tools = {};`;
  const footerFn = `\nreturn tools;\n}`;

  // Bundle Native
  const optionsBundle = {
    stdin: { contents: '' },
    banner: { js: config.COPYRIGHT + headerFn },
    footer: { js: footerFn },
    inject: getLibFiles(),
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
    sourcemap: true
  };

  const optionsCssThemes = {
    entryPoints: ['src/themes/dark.css'],
    outdir: `${config.LIB_DIR}/themes`,
    minify: true,
    bundle: true,
    sourcemap: true
  };

  esbuild.build(optionsBundle).then(result => {
    console.log("Bundle JS Lib: Build complete!");
  });

  esbuild.build(optionsMinifyMap).then(result => {
    console.log("JS Lib Minify mapped: Build complete!");
  });

  esbuild.build(optionsCssThemes).then(result => {
    console.log("Css Themes: Build complete!");
  });

}

function getLibFiles() {
  const arrFiles = [];
  const files = fs.readdirSync(`${config.SRC_TOOLS}`); 
  files.forEach(file => {
    let component = `${config.SRC_TOOLS}/${file}`;
    let componentName = file;
    if (fs.lstatSync(component).isDirectory() && !file.startsWith('_')) {
      let componentFiles = fs.readdirSync(component);
      componentFiles.forEach(filejs => {
        if (filejs.endsWith(".js")) {
          const filepath = `${config.SRC_TOOLS}/${componentName}/${filejs}`;
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