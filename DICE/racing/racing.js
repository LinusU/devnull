
exports.Racing = function (ios) {
    
    var player0 = { x: 24, y: 192, w: 16, h: 24, dx: 8 };
    var player1 = { x: 128, y: 192, w: 16, h: 24, dx: 8 };
    
    var inter = null;
    var blocks = [];
    
    var that = this;
    
    var js = function (code) {
        ios.emit('js', {
            code: code
        });
    };
    
    var alert = function (msg) {
        js('document.getElementsByTagName("h1")[0].innerHTML = "' + msg + '<br />" + document.getElementsByTagName("h1")[0].innerHTML;');
    };
    
    this.start = function () {
        
        if(inter) { return ; }
        
        inter = setInterval(function () {
            
            for(var i=0; i<blocks.length; i++) {
                
                blocks[i].y += blocks[i].dy;
                
                if(
                    blocks[i].x + 16 > player0.x && blocks[i].x < player0.x + 16 &&
                    blocks[i].y + 16 > player0.y && blocks[i].y < player0.y + 24
                ) {
                    alert("Player 0 crashed!");
                    clearInterval(inter);
                    inter = null;
                    that.draw();
                    return ;
                }
                
                if(
                    blocks[i].x + 16 > player1.x && blocks[i].x < player1.x + 16 &&
                    blocks[i].y + 16 > player1.y && blocks[i].y < player1.y + 24
                ) {
                    alert("Player 1 crashed!");
                    clearInterval(inter);
                    inter = null;
                    that.draw();
                    return ;
                }
                
            }
            
            that.draw();
            
        }, 1000/30);
        
        that.spawnBlock();
        
    };
    
    this.spawnBlock = function () {
        
        blocks.push({
            x: Math.random() * (256 - 16),
            y: -16,
            dy: 4,
            w: 16,
            h: 16
        });
        
        setTimeout(function () {
            that.spawnBlock();
        }, Math.random() * 1000);
        
    };
    
    this.draw = function () {
        
        code = 'ctx.clearRect(0, 0, 256, 256);';
        
        code += 'ctx.drawImage(car0, ' + player0.x + ', ' + player0.y + ', 16, 24);';
        code += 'ctx.drawImage(car1, ' + player1.x + ', ' + player1.y + ', 16, 24);';
        
        for(var i=0; i<blocks.length; i++) {
            code += 'ctx.drawImage(block, ' + blocks[i].x + ', ' + blocks[i].y + ', 16, 16);';
        }
        
        js(code);
        
    };
    
    this.keydown = function (p, e) {
        var pl = (p == 0)?player0:player1;
        var op = (p == 1)?player0:player1;
        var dx = pl.dx * ((e.keyCode == 37)?-1:((e.keyCode == 39)?1:0));
        if(pl.x + dx < 0) { return ; }
        if(pl.x + dx > 256 - 16) { return ; }
        if(player0.x + ((p == 0)?dx:-dx) + 16 < player1.x) {
            pl.x += dx;
        }
    };
    
};
