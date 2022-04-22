
const fs = require('fs');
const { exec } = require("child_process");
const esbuild = require("esbuild");
const config = require("./config.cjs")

function buildLib() {

  console.log("Building...");

  const options = {
    entryPoints: [config.SRC_PATH],
    entryNames: config.LIB_FILE_NAME,
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

  console.log("Running Dev Mode");

  esbuild.build({
    entryPoints: [config.SRC_PATH],
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

for (var i=0; i<process.argv.length;i++) {
  switch (process.argv[i]) {
    case 'buildLib':
      buildLib();
      break;
    case 'dev':
      dev();
      break;
  }
}

module.exports.buildLib = buildLib;
module.exports.dev = dev;