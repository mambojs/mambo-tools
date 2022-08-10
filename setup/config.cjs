// Constants
const PUBLIC_DIR = "src";
const OUTPUT_HTML = `${PUBLIC_DIR}/index.html`;
const IMAGE_DIR = `${PUBLIC_DIR}/img`;
const PUBLIC_DIRS = [IMAGE_DIR, "src", "dist"];
const PORT = process.env.PORT || 8002;

module.exports = {
	OUTPUT_HTML,
	PUBLIC_DIR,
	PUBLIC_DIRS,
	PORT,
	system: {
		publicDirectories: PUBLIC_DIRS,
		imagesDirectory: IMAGE_DIR,
		host: {
			port: PORT,
		},
	},
};
