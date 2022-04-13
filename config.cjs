const PORT = process.env.PORT || 8001;
const LIB_DIR = "tools-lib";
const LIB_NAME = "mambo-tools";
const LIB_VERSION = "last3-min";
const LIB_FILE_NAME = `${LIB_NAME}-${LIB_VERSION}`;
const LIB_FILE_JS = `${LIB_FILE_NAME}.js`;
const LIB_PATH = `${LIB_DIR}/${LIB_FILE_JS}`;

const OUTPUT_DIR = "demo";
const OUTPUT_JS = `${OUTPUT_DIR}/js/${LIB_FILE_JS}`;
const OUTPUT_CSS = `${OUTPUT_DIR}/css/${LIB_FILE_NAME}.css`;
const OUTPUT_HTML = `${OUTPUT_DIR}/index.html`;

const SRC_DIR = "src";
const SRC_PATH = `${SRC_DIR}/index.js`;

module.exports = {
    PORT,
    
    LIB_DIR,
    LIB_NAME,
    LIB_VERSION,
    LIB_FILE_NAME,
    LIB_FILE_JS,
    LIB_PATH,

    OUTPUT_DIR,
    OUTPUT_JS,
    OUTPUT_CSS,
    OUTPUT_HTML,

    SRC_DIR,
    SRC_PATH
}