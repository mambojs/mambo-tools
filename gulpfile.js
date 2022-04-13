
import pkg from 'gulp';
const { series, src, dest, parallel, watch } = pkg;
import processhtml from 'gulp-processhtml';
import htmlmin from 'gulp-htmlmin';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
import writeheader from 'gulp-header';
import fs from 'fs';
import config from './config.cjs';
import { createServer } from 'http';

function demos() {
    const demosjs = []; 
    const components = [];
    const toolsDir = fs.readdirSync(config.SRC_TOOLS);
    let write_demo = '';

    toolsDir.forEach(tool => {
        let component_values = {}
         
        // Check if file is a directory
        if (fs.lstatSync(`${config.SRC_TOOLS}/${tool}`).isDirectory()) {
            component_values.name = tool;
            fs.readdirSync(`${config.SRC_TOOLS}/${tool}`).forEach(demo => {
                if(fs.lstatSync(`${config.SRC_TOOLS}/${tool}/${demo}`).isDirectory()) {
                    fs.readdirSync(`${config.SRC_TOOLS}/${tool}/${demo}`).forEach(js => {
                        if(js.endsWith(".js")) {
                            demosjs.push(`${config.SRC_TOOLS}/${tool}/${demo}/${js}`)
                            component_values.alias = js.replace('.js', '');
                        }
                    })
                } else {
                    component_values.component = demo;
                }
            })
        }
        components.push(component_values);

    })

    write_demo = `
        window["demotools"] = {};
        window["demotools"].components = ${JSON.stringify(components)};
        `;

    demosjs.push('reload.js');

    return src(demosjs)
        .pipe(sourcemaps.init())
        .pipe(concat(`index.js`))
        .pipe(writeheader(write_demo))
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