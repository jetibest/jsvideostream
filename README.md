# jsvideostream

Live videostream in any browser using a Javascript client from an FFMpeg command (`ffmpeg`).
The advantage of using websockets like this, and decoding H264/MPEG-TS in Javascript, is raw access to the videostream at the client-side, and minimizing lag/latency as there is barely any protocol overhead and the chunks never contain more than one frame at a time.

This is just an example of how it could be done, but you could easily customize this setup:

 - You could use any webserver to substitute NodeJS (`node`), which is used to forward regular sockets to websockets.
 - You could easily pipe NetCat (`nc`) through OpenSSL to encrypt the backend connection.
 - You could use `wss://` instead of `ws://` to encrypt the frontend connection with TLS.
 - You might need to replace `ffmpeg` to `avconv` if the former is not installed on your system.
 - You could transform `server/run.sh` to a batch file (`server/run.bat`), to support Microsoft Windows as your backend.
 - You could use [Prism](https://github.com/guodong/prism) instead of Broadway, e.g. using `var pr = prism.create(); pr.decodeNal(uint8arr.buffer); /* use pr.SL, pr.SCb, pr.SCr */`.
 - You could feed an MP4 file directly to NetCat instead of using FFMpeg, e.g. replacing the `ffmpeg` command with `cat file.mp4`.

## Install

    git clone https://github.com/jetibest/jsvideostream.git
    cd jsvideostream

## Usage

    # backend
    server/run.sh
    
    # frontend (only tested on firefox, but any modern browser should work)
    firefox client/index.html 2>/dev/null
    
## Libraries

This project uses [Broadway](https://github.com/mbebenita/Broadway) for displaying H264 frames and [JSMpeg](https://github.com/phoboslab/jsmpeg) for MPEG-TS demuxing.

The back-end currently depends on NodeJS, NetCat, NodeJS, FFMpeg (with H264), and Firefox. But these components may easily be modified to use alternatives.
