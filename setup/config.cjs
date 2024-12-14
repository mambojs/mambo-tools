// Constants
const PUBLIC_DIR = "public";
const SRC_DIR = "src";
const OUTPUT_HTML_DEV = `${PUBLIC_DIR}/index-dev.html`;
const OUTPUT_HTML_PROD = `${PUBLIC_DIR}/index-prod.html`;
const IMAGE_DIR = `${PUBLIC_DIR}/img`;
const PUBLIC_DIRS_DEV = [IMAGE_DIR, "src", "dist", "public"];
const PUBLIC_DIRS_PROD = [IMAGE_DIR, "dist", "public"];
const PORT = process.env.PORT || 8002;

module.exports = {
	OUTPUT_HTML_DEV,
	OUTPUT_HTML_PROD,
	PUBLIC_DIR,
	PUBLIC_DIRS_DEV,
	PUBLIC_DIRS_PROD,
	SRC_DIR,
	PORT,
	system: {
		publicDirectoriesDev: PUBLIC_DIRS_DEV,
		publicDirectoriesProd: PUBLIC_DIRS_PROD,
		imagesDirectory: IMAGE_DIR,
		host: {
			port: PORT,
		},
	},
};
