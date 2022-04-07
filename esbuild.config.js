// #!/usr/bin/env node

import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
const port = process.env.PORT || 8001;
import esbuild from "esbuild";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const sourceFolder = "src";
const outputLibFolder = "dist";
const outputDemoFolder = "demo";
const nameFile = "mambo-tools";
const version = "last-min";

const clients = [];

const build = esbuild.build({
  entryPoints: [`${sourceFolder}/index.js`],
  outfile: `${outputDemoFolder}/js/${nameFile}-${version}.js`,
  bundle: true,
  loader: {
    ".html": "text"
  },
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
  console.log('watching...')
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