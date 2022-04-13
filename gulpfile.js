
import pkg from 'gulp';
const { series, src, dest, parallel, watch } = pkg;
import processhtml from 'gulp-processhtml';
import htmlmin from 'gulp-htmlmin';

function html() {
    return src(`src/index.html`)
        .pipe(processhtml())
        .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true, minifyCSS: true }))
        .pipe(dest(`demo`))
}

function watchChanges() {
    const watcher = watch(`src/index.html`, html);

    watcher.on('change', (path, stats) => {
        console.log(`Gulp: File ${path} was changed`);
    })
}

export { html, watchChanges };
// export default series( html );