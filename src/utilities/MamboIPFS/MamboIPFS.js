/******************************************
 *  Copyright 2022 Alejandro Sebastian Scotti, Scotti Corp.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.

 *  Author : Alejandro Scotti
 *  Created On : Sat Feb 26 2022
 *  File : MamboIPFS.js
 *******************************************/
function MamboIPFS() {

    let ipfs;
    let readFile;
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

    /* async function createIpfs() {
         ipfs = await Ipfs.create({repo: 'ipfs-' + Math.random()});
     }*/

    function setupHls() {

        Hls.DefaultConfig.loader = HlsjsIpfsLoader;
        Hls.DefaultConfig.debug = false;
        const isSup = Hls.isSupported();
        if (isSup) {
            const video = document.createElement('video');
            const hls = new Hls();
            hls.config.ipfs = ipfs;
            hls.config.ipfsHash = 'QmdccEyrTxfvMiKAkQYBs9h8XDyZ6Hw8JJjRGGpVmyyZjF';
            hls.loadSource('master.m3u8');
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
        }
    }


    function conSetup() {
        /*        const results = await ipfs.add('=^.^= meow meow');
                const cid = results[0].hash;
                console.log('CID created via ipfs.add:', cid);
                const data = await ipfs.cat(cid);
                console.log('Data read back via ipfs.cat:', new TextDecoder().decode(data))*/
    }

}