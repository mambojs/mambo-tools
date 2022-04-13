
const fs = require('fs');
const { exec } = require("child_process");
const esbuild = require("esbuild");
const { createServer } = require("http");
const config = require("./config.cjs")

// const clients = [];

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
    // banner: {
    //   js: ' (() => new EventSource("http://localhost:8008").onmessage = () => location.reload())();',
    // },
    watch: {
      onRebuild(error, result) {
        if (error) {
          console.error('watch build failed:', error)
        }
        else 
        {
          console.log('esbuild: Rebuild success')
          // clients.forEach((res) => res.write("data: update\n\n"));
          // clients.length = 0;
          console.log(error ? error : "...");
        }
      }
    }
  }).then(result => {
    checkHTMLexists()
    console.log('Watching...')
  })

  // createServer((req, res) => {
  //   return clients.push(
  //     res.writeHead(200, {
  //       "Content-Type": "text/event-stream",
  //       "Cache-Control": "no-cache",
  //       "Access-Control-Allow-Origin": "*",
  //       Connection: "keep-alive",
  //     }),
  //   );
  // }).listen(8008);
  
}

function checkHTMLexists() {
  if (!fs.existsSync(config.OUTPUT_HTML)) {
    console.log("Building HTML...");
    exec('gulp html', (err, stdout, stderr) => {
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
  }
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