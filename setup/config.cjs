// Constants
const PUBLIC_DIR = "public";
const SRC_DIR = "src";
const OUTPUT_HTML = `${PUBLIC_DIR}/index.html`;
const IMAGE_DIR = `${PUBLIC_DIR}/img`;
const PUBLIC_DIRS = [IMAGE_DIR, "dist", "public"];
const PORT = process.env.PORT || 8002;

module.exports = {
	OUTPUT_HTML,
	PUBLIC_DIR,
	PUBLIC_DIRS,
	SRC_DIR,
	PORT,
	system: {
		publicDirectories: PUBLIC_DIRS,
		imagesDirectory: IMAGE_DIR,
		host: {
			port: PORT,
		},
	},
};
