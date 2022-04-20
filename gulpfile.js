
import pkg from 'gulp';
const { series, src, dest, parallel, watch } = pkg;
import processhtml from 'gulp-processhtml';
import htmlmin from 'gulp-htmlmin';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
import writeheader from 'gulp-header';
import writefooter from 'gulp-footer';
import fs from 'fs';
import config from './config.cjs';
import { createServer } from 'http';

function demos() {
    //const demosjs = []; 
    const components = [];
    const toolsDir = fs.readdirSync(config.SRC_TOOLS);
    let write_demo = '';

    toolsDir.forEach(tool => {

        let component_values = {}
         
        // Check if file is a directory
        let component = `${config.SRC_TOOLS}/${tool}`;

        if (fs.lstatSync(component).isDirectory()) {

            fs.readdirSync(component).forEach(demof => {

                let demo = `${component}/${demof}`;

                if (fs.lstatSync(demo).isDirectory()) {

                    fs.readdirSync(demo).forEach(jsf => {

                        let js = `${demo}/${jsf}`;

                        if (js.endsWith(".js")) {

                            let alias = jsf.replace('.js', '');
                            //demosjs.push(js)
                            component_values.alias = alias;
                            component_values.name = tool;
                            component_values.script = getScript(js);
                            component_values.custom = `demo-${alias}`;
                        }

                    })

                } else {
                    component_values.component = demof;
                }

            })

        }

        if (component_values.alias) {
            components.push(component_values);
        }

    })

    write_demo = `
        window.demotools = {};
        window.demotools.components = ${JSON.stringify(components)};
        `;

    //demosjs.push('reload.js');
    
    return src('demos_base.js')
        .pipe(sourcemaps.init())
        .pipe(concat(`index.js`))
        .pipe(writeheader(write_demo))
        .pipe(writeheader(getScript('reload.js')))
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

function getScript(file) {
    return fs.readFileSync(file, 'utf8');
}

export { demos, html, watchChanges };
// export default series( html );