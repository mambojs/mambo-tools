
import pkg from 'gulp';
const { series, src, dest, parallel, watch } = pkg;
import processhtml from 'gulp-processhtml';

function html() {
    return src(`src/index.html`)
        .pipe(processhtml())
        .pipe(dest(`demo`))
}

export default series( html );