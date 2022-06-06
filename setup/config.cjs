const PORT_DEV = 8001;
const PORT_RELOAD = 8008;
const PORT = process.env.PORT || PORT_DEV;
const LIB_DIR = "tools-lib";
const LIB_NAME = "mambo-tools";
const LIB_VERSION = "last-min";
const LIB_FILE_NAME = `${LIB_NAME}-${LIB_VERSION}`;
const LIB_FILE_JS = `${LIB_FILE_NAME}.js`;
const LIB_PATH = `${LIB_DIR}/${LIB_FILE_JS}`;

const OUTPUT_DIR = "demo";
const OUTPUT_JS = `${OUTPUT_DIR}/lib/${LIB_FILE_JS}`;
const OUTPUT_CSS = `${OUTPUT_DIR}/css/${LIB_FILE_NAME}.css`;
const OUTPUT_HTML = `${OUTPUT_DIR}/index.html`;

const SRC_DIR = "src";
const SRC_PATH = `${SRC_DIR}/configs/mamboInitializer.js`;
const SRC_PATH_DEPS = `${SRC_DIR}/configs/mamboInitializer-deps.js`;
const SRC_TOOLS = `${SRC_DIR}/tools`;

module.exports = {
    PORT,
    PORT_DEV,
    PORT_RELOAD,
    
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
    SRC_PATH,
    SRC_PATH_DEPS,
    SRC_TOOLS
}