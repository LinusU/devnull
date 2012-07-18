
var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    Mud = require('./mud');

app.listen(8080);

function handler (req, res) {
    
    fs.readFile(__dirname + '/index.html', function (r, data) {
        res.writeHead(200);
        res.end(data);
    });
    
}

var names = ['Gurm','Wizzy','Gramare','Farnsworth','Leatherman','Dirkel','Wultar','Ertnar','Ramsturr','Topang','Yangel','Uba','Ianio','Ompunt','Perpangs','Almangsargar','Swakmut','Djonksap','Fillopp','Gingar','Hunn','Jyltsman','Klaus','Lokkfaust','Zunkary','Xermanxes','Cinna', 'Vinteydir','Blump','Njugg','Masmansh','Quaouyg'];

var mud = new Mud.Mud();

io.sockets.on('connection', function (socket) {
    
    var name = names[Math.floor(Math.random() * names.length)];
    
    //var id = mud.newPlayer(socket.handshake.address.address + ":" + socket.handshake.address.port);
    var id = mud.newPlayer(name);
    
    socket.emit('id', id);
    
    socket.emit('msg', "Go through a door by writing 'go north/east/south/west'.");
    socket.emit('msg', "Pick up an item by writing 'take thing'. Drop an item you possess by writing 'drop item'.");
    socket.emit('msg', "");
    
    socket.emit('msg', "You'r name is " + name);
    socket.emit('msg', "You wake up. There are doors to the north, west and east.");
    
    mud.items(id, function (data) {
        socket.emit('msg', data);
    });
    
    mud.players(id, function (data) {
        socket.emit('msg', data);
    });
    
    socket.on('cmd', function (data) {
        
        mud.command(id, data, function (data) {
            socket.emit('msg', data);
        });
        
    });
    
    socket.on('disconnect', function (data) {
        
        mud.removePlayer(id);
        
    });
    
});
