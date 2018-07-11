#!/bin/bash
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# WebSockets forwarding
node "$dir/wsforward.js" &
nodepid="$!"
trap "kill $nodepid 2>/dev/null" EXIT

# FFMpeg h264 settings
codec="h264_nvenc" # h264_nvenc, libx264, h264_omx
bitrate="500k"
framerate="15"
profile="baseline" # baseline, main, high
config="-pix_fmt yuv420p -tune zerolatency"
flags=""
output="mpegts"

## For chunked MP4:
#    flags="-movflags frag_keyframe+empty_moov -g 52"
#    output="mp4"

# NetCat settings
host="127.0.0.1"
port="8083"

ffmpeg -i /dev/video0 -c:v $codec -r $framerate -b:v $bitrate -profile:v $profile $config $flags -f $output - | nc -l -p $port $host
