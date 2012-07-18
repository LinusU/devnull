
var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    Tetris = require('./tetris').Tetris;

app.listen(8080);

function handler (req, res) {
    
    fs.readFile(__dirname + '/tetris2.html', function (r, data) {
        res.writeHead(200);
        res.end(data);
    });
    
}

function attackPlayer(id) {
    pls[id].attackBlock();
};

var pls = [
    new Tetris(0, io.sockets, function () {
        attackPlayer(1);
    }),
    new Tetris(1, io.sockets, function () {
        attackPlayer(0);
    })
];

var joined = 0;

io.sockets.on('connection', function (socket) {
    
    socket.on('keydown', function (data) {
        
        console.log('keydown');
        
        pls[data.id].event(data.event);
        
    });
    
    socket.on('join', function (data) {
        
        console.log('join');
        
        if(++joined == 2) {
            
            pls[0].newBlock();
            pls[1].newBlock();
            
            setInterval(function () {
                pls[0].draw();
                pls[1].draw();
            }, 1000/30);
            
        }
        
    });
    
});
