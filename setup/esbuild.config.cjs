
const fs = require('fs');
const { exec } = require("child_process");
const esbuild = require("esbuild");
const config = require("./config.cjs");
const cssModulesPlugin = require('esbuild-css-modules-plugin');

function buildLib() {

  intializerFile('mamboInitializer.js');
  
  console.log("Building library...");

  const optionsJS = {
    entryPoints: [config.SRC_PATH],
    entryNames: config.LIB_FILE_NAME,
    outdir: config.LIB_DIR,
    minify: true,
    bundle: true,
    sourcemap: true,
    plugins: [ cssModulesPlugin() ]
  };

  // const optionsCssThemes = {
  //   entryPoints: ['src/themes/dark.css'],
  //   outdir: `${config.LIB_DIR}/themes`,
  //   minify: true,
  //   bundle: true,
  //   sourcemap: true,
  //   plugins: [ cssModulesPlugin() ]
  // };

  esbuild.build(optionsJS).then(result => {
    console.log("JS Lib: Build complete!");
  });
  // esbuild.build(optionsCssThemes).then(result => {
  //   console.log("Css Themes: Build complete!");
  // });

}

function buildLibDeps() {

  intializerFile('mamboInitializer-deps.js');
  
  console.log("Building library with dependencies...");

  const options = {
    entryPoints: [config.SRC_PATH_DEPS],
    entryNames: `${config.LIB_FILE_NAME}-deps`,
    outdir: config.LIB_DIR,
    minify: true,
    bundle: true,
    sourcemap: true
  };

  esbuild.build(options).then(result => {
    console.log("Build complete!");
  });

}

function dev() {

  intializerFile('mamboInitializer-deps.js');
  
  console.log("Running Dev Mode");

  esbuild.build({
    entryPoints: [config.SRC_PATH_DEPS],
    outfile: config.OUTPUT_JS,
    bundle: true,
    minify: true,
    sourcemap: true,
    watch: {
      onRebuild(error, result) {
        if (error) {
          console.error('watch build failed:', error)
        }
        else 
        {
          console.log('esbuild: index.js rebuilt');
        }
      }
    }
  }).then(result => {
    exec('gulp -f ./setup/gulpfile.js demos', (err, stdout, stderr) => {
      if (err) {
          console.log(`error: ${err.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
    })
    checkHTMLexists()
    console.log('Watching lib...')
  })
  
}

function checkHTMLexists() {
  //if (!fs.existsSync(config.OUTPUT_HTML)) {
    console.log("Building HTML...");
    exec('gulp -f ./setup/gulpfile.js html', (err, stdout, stderr) => {
      if (err) {
          console.log(`error: ${err.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
    })
  //}
}

function intializerFile(intializerFile) {

  /* Write intializer file from src folder */

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

    fs.writeFileSync(intializerFilePath, newText);
  });

}

for (var i=0; i<process.argv.length;i++) {
  switch (process.argv[i]) {
    case 'buildLib':
      buildLib();
      break;
    case 'buildLibDeps':
      buildLibDeps();
      break;
    case 'dev':
      dev();
      break;
  }
}

module.exports.buildLib = buildLib;
module.exports.buildLibDeps = buildLibDeps;
module.exports.dev = dev;