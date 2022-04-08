// #!/usr/bin/env node

// import express from 'express';
// import path from "path";
// import { fileURLToPath } from 'url';
// import fs from "fs";
// const port = process.env.PORT || 8001;
// import esbuild from "esbuild";
const { exec } = require("child_process");
const esbuild = require("esbuild");

// import { createServer } from "http";
const { createServer } = require("http");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
const sourceFolder = "src";
const outputLibFolder = "tools-lib";
const outputDemoFolder = "demo";
const nameFile = "mambo-tools";
const version = "last3-min";

const clients = [];

function buildLib() {

  console.log("Building...");

  const options = {
    entryPoints: [`${sourceFolder}/index.js`],
    entryNames: `${nameFile}-${version}`,
    outdir: `${outputLibFolder}`,
    // outfile: `${outputLibFolder}/js/${nameFile}-${version}.js`,
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
    entryPoints: [`${sourceFolder}/index.js`],
    outfile: `${outputDemoFolder}/js/${nameFile}-${version}.js`,
    bundle: true,
    // metafile: true,
    minify: true,
    sourcemap: true,
    banner: {
      js: ' (() => new EventSource("http://localhost:8008").onmessage = () => location.reload())();',
    },
    watch: {
      onRebuild(error, result) {
        if (error) {
          console.error('watch build failed:', error)
        }
        else 
        {
          console.log('watch build succeeded:', result)
          clients.forEach((res) => res.write("data: update\n\n"));
          clients.length = 0;
          console.log(error ? error : "...");
        }
      }
    }
  }).then(result => {
    exec('gulp', (err, stdout, stderr) => {
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
    console.log('Watching...')
  })

  createServer((req, res) => {
    return clients.push(
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        Connection: "keep-alive",
      }),
    );
  }).listen(8008);
  
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