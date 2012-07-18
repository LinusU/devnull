
var app = require('http').createServer(handler),
    fs = require('fs');

app.listen(8080);

function handler (req, res) {
    
    if(req.url.length > 2) {
        
        setTimeout(function () {
            res.writeHead(200);
            res.end(req.url);
        }, Math.round(100 + Math.random() * 900));
        
    } else {
        
        fs.readFile(__dirname + '/index.html', function (r, data) {
            res.writeHead(200);
            res.end(data);
        });
        
    }
}
