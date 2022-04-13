
import pkg from 'gulp';
const { series, src, dest, parallel, watch } = pkg;
import processhtml from 'gulp-processhtml';
import htmlmin from 'gulp-htmlmin';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
import fs from 'fs';
import config from './config.cjs';
import { createServer } from 'http';

function demos() {
    const demosjs = []; 
    const tools = fs.readdirSync(config.SRC_TOOLS);
    tools.forEach(file => {
        // Check if file is a directory
        if (fs.lstatSync(`${config.SRC_TOOLS}/${file}`).isDirectory()) {
        fs.readdirSync(`${config.SRC_TOOLS}/${file}`).forEach(file2 => {
            if(fs.lstatSync(`${config.SRC_TOOLS}/${file}/${file2}`).isDirectory()) {
            fs.readdirSync(`${config.SRC_TOOLS}/${file}/${file2}`).forEach(file3 => {
                if(file3.endsWith(".js")) {
                demosjs.push(`${config.SRC_TOOLS}/${file}/${file2}/${file3}`)
                }
            })
            }
        })
        }
    })

    demosjs.push('reload.js');

    return src(demosjs)
        .pipe(sourcemaps.init())
        .pipe(concat(`index.js`))
        .pipe(terser())
        .pipe(sourcemaps.write('./'))
        .pipe(dest('./demo/js/demos'))
}

function html() {
    return src(`src/index.html`)
        .pipe(processhtml())
        .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true, minifyCSS: true }))
        .pipe(dest(`demo`))
}

function watchChanges() {
    const clients = [];

    const watcher = watch(`src/**/*`, parallel(html, demos));
    watcher.on('all', (path, stats) => {
        console.log(`Gulp: ${path} - ${stats}`);
    })
    const changed = watch(`demo/**/*`, function (cb){
        clients.forEach((res) => res.write("data: update\n\n"));
        clients.length = 0;
        console.log(`Gulp: demo changed`);
        cb();
    });
    changed.on('all', (path, stats) => {
        console.log(`Complete: ${path} - ${stats}`);
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
    }).listen(config.PORT_RELOAD);
}

export { demos, html, watchChanges };
// export default series( html );