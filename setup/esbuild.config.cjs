
const fs = require('fs');
const { exec } = require("child_process");
const esbuild = require("esbuild");
const config = require("./config.cjs");
const cssModulesPlugin = require('esbuild-css-modules-plugin');

function buildLib() {

  intializerFile('mamboInitializer.js');
  
  console.log("Building library...");

  const optionsJSMAP = {
    entryPoints: [config.SRC_PATH],
    entryNames: config.LIB_FILE_NAME,
    outdir: `${config.LIB_DIR}/${config.LIB_VERSION}/${config.LIB_MAP}`,
    minify: true,
    bundle: true,
    sourcemap: true,
    plugins: [ cssModulesPlugin() ]
  };

  const optionsJS = {
    entryPoints: [config.SRC_PATH],
    entryNames: config.LIB_FILE_NAME,
    outdir: `${config.LIB_DIR}/${config.LIB_VERSION}`,
    minify: true,
    bundle: true,
    plugins: [ cssModulesPlugin() ]
  };

  const optionsCssThemes = {
    entryPoints: ['src/themes/dark.css'],
    outdir: `${config.LIB_DIR}/themes`,
    minify: true,
    bundle: true,
    sourcemap: true,
    plugins: [ cssModulesPlugin() ]
  };

  esbuild.build(optionsJSMAP).then(result => {
    console.log("JS Lib Map: Build complete!");
  });
  esbuild.build(optionsJS).then(result => {
    console.log("JS Lib: Build complete!");
  });
  esbuild.build(optionsCssThemes).then(result => {
    console.log("Css Themes: Build complete!");
  });

}

function intializerFile(intializerFile) {

  /* Write intializer file from src folder */
  console.log("Writing intializer file...");

  let newText = "";
  const intializerFilePath = `${config.SRC_DIR}/configs/${intializerFile}`;
  const libraryImportPaths = [];
  const uiFiles = fs.readdirSync(`${config.SRC_DIR}/tools`); 

  uiFiles.forEach(file => {
    let component = `${config.SRC_DIR}/tools/${file}`;
    let componentName = file;
    if (fs.lstatSync(component).isDirectory() && !file.startsWith('_')) {
      let componentFiles = fs.readdirSync(component);
      componentFiles.forEach(filejs => {
        if (filejs.endsWith(".js")) {
          const filepath = `../tools/${componentName}/${filejs}`;
          const script = `\timport("${filepath}");`;
          libraryImportPaths.push(script);
        }
      });
    }
  });
  
  fs.readFile(intializerFilePath, 'utf8', (err, fd) => {
    if (err) {
      throw 'error opening file: ' + err;
    }
    
    newText = fd.replace(/(?<=\/\/\@)([\s\S]*?)(?=\/\/\!)/gm, `\n${libraryImportPaths.join('\n')}\n`);

    try {
      fs.writeFileSync(intializerFilePath, newText);

      console.log("Intializer file written!");
    } catch (error) {
      console.log(error);
    }
  });

}

for (var i=0; i<process.argv.length;i++) {
  switch (process.argv[i]) {
    case 'buildLib':
      buildLib();
      break;
  }
}

module.exports.buildLib = buildLib;