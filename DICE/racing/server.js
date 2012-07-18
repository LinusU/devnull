
var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    Racing = require('./racing').Racing;

app.listen(8080);

function handler (req, res) {
    
    fs.readFile(__dirname + ((req.url == "/")?"/index.html":req.url), function (r, data) {
        res.writeHead(200);
        res.end(data);
    });
    
}

var joined = 0;

var racing = new Racing(io.sockets);

io.sockets.on('connection', function (socket) {
    
    socket.on('keydown', function (data) {
        
        racing.keydown(data.id, data.event);
        
    });
    
    socket.on('keyup', function (data) {
        
        racing.keyup(data.id, data.event);
        
    });
    
    socket.on('join', function (data) {
        
        if(++joined == 2) {
            
            racing.start();
            
        }
        
    });
    
});
