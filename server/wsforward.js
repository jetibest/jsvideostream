const net = require('net');
const WebSocket = require('ws');

var config = {
    forwardport: 8083,
    forwardhost: '127.0.0.1',
    port: 8084,
    host: '127.0.0.1'
};

var wss = new WebSocket.Server({port: config.port, host: config.host});
wss.on('connection', function(ws)
{
    var conn = net.createConnection(config.forwardport, config.forwardhost);
    conn.on('data', function(buf)
    {
        console.log('Forwarding ' + buf.length + ' bytes.');
        ws.send(buf);
    });
    conn.on('end', function()
    {
        console.log('Connection closed. Closing websocket.');
        try
        {
            if(ws && ws.close)
            {
                ws.close();
            }
        }
        catch(err){}
    });
    
    ws.on('message', function(str)
    {
        console.log('Receiving ' + str.length + ' chars.');
        conn.write(str);
    });
    ws.on('end', function()
    {
        console.log('Websocket closed. Closing connection.');
        try
        {
            if(conn && conn.close)
            {
                conn.close();
            }
        }
        catch(err){}
    });
});
