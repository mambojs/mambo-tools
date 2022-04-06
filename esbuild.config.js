// #!/usr/bin/env node

import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
const port = process.env.PORT || 8001;
import esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const sourceFolder = "src";
const outputLibFolder = "dist";
const outputDemoFolder = "demo";
const nameFile = "mambo-tools";
const version = "imports-1.1.1";

// esbuild.build({
//   entryPoints: [`${sourceFolder}/index.js`],
//   outfile: `${outputDemoFolder}/js/${nameFile}-${version}.js`,
//   bundle: true,
//   watch: {
//     onRebuild(error, result) {
//       if (error) console.error('watch build failed:', error)
//       else console.log('watch build succeeded:', result)
//     }
//   }
// }).then(result => {
//   console.log('watching...')
// })

esbuild.serve ({
  port: port,
  servedir: `demo`
}, {
  entryPoints: [`src/index.js`],
  bundle: true,
  // outdir: `demo/js`,
  outfile: "demo/js/mambo-tools-imports-2.1.1.js",
}).then( server => {
  // server.stop()
  //setting middleware
  //Serves resources from public folder
  app.use(express.static(`${__dirname}/demo`));

  // Return Index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "demo/index.html"));
  });

  // Start up Application
  app.listen(port);
  console.log(`Listening on http://localhost:${port}`);

})

// import esbuildServe from "esbuild-serve";

// esbuildServe(
//     {
//       logLevel: "info",
//       entryPoints: ["src/index.js"],
//       bundle: true,
//       outfile: "demo/js/mambo-tools-imports-2.1.1.js",
//       sourcemap: true,
//       minify: true,
//     },
//     { 
//       port: 8002,
//       root: "demo"
//     }
//   );


/** Build from sourceFolder to outputFolder */
// function getFiles(path) {
//   return fs.readdirSync(path).reduce((files, file) => {
//     const name = `${path}/${file}`;
//     return fs.statSync(name).isDirectory()
//       ? [...files, ...getFiles(name)]
//       : [...files, name];
//   }, []);
// }

// const filesToBuild = getFiles(sourceFolder);

// esbuild.buildSync({
//   bundle: true,
//   entryPoints: ['index.js'],
//   inject: filesToBuild,
//   outfile: `${outputFolder}/${nameFile}-${version}.js`,
//   minify: true,
// })


/** Build from mamboInitializer.js */
// esbuild.buildSync({
//   bundle: true,
//   entryPoints: ['src/configs/mamboInitializer.js'],
//   outfile: `${outputFolder}/${nameFile}-${version}.js`,
//   minify: true,
// })