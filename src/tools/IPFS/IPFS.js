tools.class.IPFS = function IPFS() {
	// Clearly, not developed yet :-)
	/* let ipfs;
	const parserm3u8 = new m3u8Parser.Parser();

	async function testAsyncIterator() {
		let playlist;
		for await (const chunk of ipfs.cat("QmdccEyrTxfvMiKAkQYBs9h8XDyZ6Hw8JJjRGGpVmyyZjF")) {
			console.info(chunk);
			playlist = chunk;
		}
		parserm3u8.push(playlist);
		parserm3u8.end();
		console.table(parserm3u8.manifest.segments);
	}

	async function createIpfs() {
         ipfs = await Ipfs.create({repo: 'ipfs-' + Math.random()});
     }

	function setupHls() {
		Hls.DefaultConfig.loader = HlsjsIpfsLoader;
		Hls.DefaultConfig.debug = false;
		const isSup = Hls.isSupported();
		if (isSup) {
			const video = document.createElement("video");
			const hls = new Hls();
			hls.config.ipfs = ipfs;
			hls.config.ipfsHash = "QmdccEyrTxfvMiKAkQYBs9h8XDyZ6Hw8JJjRGGpVmyyZjF";
			hls.loadSource("master.m3u8");
			hls.attachMedia(video);
			hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
		}
	}

	function conSetup() {
		const results = await ipfs.add('=^.^= meow meow');
		const cid = results[0].hash;
		console.log('CID created via ipfs.add:', cid);
		const data = await ipfs.cat(cid);
		console.log('Data read back via ipfs.cat:', new TextDecoder().decode(data))
	} */
};

tools.ipfs = (props) => new tools.class.IPFS(props);
