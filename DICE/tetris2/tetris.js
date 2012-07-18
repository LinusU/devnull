
exports.Tetris = function (globalID, ios, attackOther) {
    
    var score = 0;
    /*
    var can = document.getElementById('canvas' + globalID);
    var ctx = can.getContext("2d");
    */
    var block = null;
    var blocks = [];
    var attackBlocks = [];
    
    var that = this;
    
    var nextAttackX = 2;
    
    var js = function (code) {
        ios.emit('js', {
            code: code,
            id: globalID
        });
    };
    
    var alert = function (msg) {
        js('document.getElementsByTagName("h1")[0].innerHTML = "' + msg + '<br />" + document.getElementsByTagName("h1")[0].innerHTML;');
    };
    
    this.newBlock = function () {
        
        block = {
            type: ['line','block','pixel'][Math.floor(Math.random() * 2)],
            x: 4,
            y: -3,
            c: ['red','green','blue','maroon'][Math.floor(Math.random() * 4)],
            int: setInterval(function () {
                
                if(that.collBlock(block)) {
                    that.pixelBlock(block);
                    clearInterval(block.int);
                    block = null;
                    setTimeout(function (o) { o.newBlock() }, 750 / 4, that);
                    return ;
                }
                
                block.y += 1;
                
                that.removeBlocks();
                
            }, 750 / 4)
        };
        
        if(that.collBlock(block)) {
            alert("Player " + globalID + " lost!");
            clearInterval(block.int);
            block = null;
        }
        
    };
    
    this.attackBlock = function () {
        
        var block;
        
        block = {
            type: ['line','block','pixel'][Math.floor(Math.random() * 2)],
            x: nextAttackX,
            y: -3,
            c: ['red','green','blue','maroon'][Math.floor(Math.random() * 4)],
            int: setInterval(function () {
                
                if(that.collBlock(block)) {
                    that.pixelBlock(block);
                    clearInterval(block.int);
                    var nabs = [];
                    for(var i=0; i<attackBlocks.length; i++) {
                        if(attackBlocks[i] !== block) {
                            nabs.push(attackBlocks[i]);
                        }
                    }
                    attackBlocks = nabs;
                    block = null;
                    return ;
                }
                
                block.y += 1;
                
                that.removeBlocks();
                
            }, 750 / 4)
        };
        
        if(nextAttackX == 2) {
            nextAttackX = 6;
        } else {
            nextAttackX = 2;
        }
        
        if(that.collBlock(block)) {
            alert("Player " + globalID + " lost!");
            clearInterval(block.int);
            block = null;
        }
        
        attackBlocks.push(block);
        
    };
    
    this.drawBlock = function (b) {
        
        if(!b) { console.log("WTF!"); return ''; }
        
        var code = '';
        
        code += 'ctx.beginPath();';
        
        if(b.type == 'line') {
            code += 'ctx.rect(' + (b.x * 8) + ', ' + ((b.y - 2) * 8) + ', 8, 32);';
        }
        
        if(b.type == 'block') {
            code += 'ctx.rect(' + ((b.x - 1) * 8) + ', ' + ((b.y - 1) * 8) + ', 16, 16);';
        }
        
        if(b.type == 'pixel') {
            code += 'ctx.rect(' + (b.x * 8) + ', ' + (b.y * 8) + ', 8, 8);';
        }
        
        code += 'ctx.fillStyle = "' + b.c + '";';
        code += 'ctx.fill();';
        
        return code;
    };
    
    this.collBlock = function (b) {
        
        if(!b) { console.log("WTF!"); return false; }
        
        var i;
        
        if(b.type == 'line') {
            if(b.y == 10) { return true; }
            for(i=0; i<blocks.length; i++) {
                if(b.x == blocks[i].x && b.y + 2 == blocks[i].y) {
                    return true;
                }
            }
        }
        
        if(b.type == 'block') {
            if(b.y == 11) { return true; }
            for(i=0; i<blocks.length; i++) {
                if((b.x == blocks[i].x || b.x - 1 == blocks[i].x) && b.y + 1 == blocks[i].y) {
                    return true;
                }
            }
        }
        
        if(b.y == 12) {
            return true;
        }
        
        return false;
    };
    
    this.pixelBlock = function (b) {
        
        if(b.type == 'line') {
            blocks.push({
                type: 'pixel',
                x: b.x,
                y: b.y - 2,
                c: b.c
            });
            blocks.push({
                type: 'pixel',
                x: b.x,
                y: b.y - 1,
                c: b.c
            });
            blocks.push({
                type: 'pixel',
                x: b.x,
                y: b.y,
                c: b.c
            });
            blocks.push({
                type: 'pixel',
                x: b.x,
                y: b.y + 1,
                c: b.c
            });
        }
        
        if(b.type == 'block') {
            blocks.push({
                type: 'pixel',
                x: b.x - 1,
                y: b.y - 1,
                c: b.c
            });
            blocks.push({
                type: 'pixel',
                x: b.x - 1,
                y: b.y,
                c: b.c
            });
            blocks.push({
                type: 'pixel',
                x: b.x,
                y: b.y - 1,
                c: b.c
            });
            blocks.push({
                type: 'pixel',
                x: b.x,
                y: b.y,
                c: b.c
            });
        }
        
    };
    
    this.removeBlocks = function () {
        
        var y, i, rows = [];
        
        for(y=0; y<12; y++) { rows.push(0); }
        
        for(i=0; i<blocks.length; i++) {
            
            y = blocks[i].y;
            
            if(blocks[i].type == 'line') {
                rows[y - 2] += 1;
                rows[y - 1] += 1;
                rows[y + 0] += 1;
                rows[y + 1] += 1;
            }
            
            if(blocks[i].type == 'block') {
                rows[y - 2] += 0;
                rows[y - 1] += 2;
                rows[y + 0] += 2;
                rows[y + 1] += 0;
            }
            
            if(blocks[i].type == 'pixel') {
                rows[y + 0] += 1;
            }
            
        }
        
        console.log(rows);
        
        var shouldAttack = false;
        
        for(y=0; y<rows.length; y++) {
            if(rows[y] >= 8) {
                
                var nb = [];
                
                for(i=0; i<blocks.length; i++) {
                    if(blocks[i].y < y) {
                        blocks[i].y ++;
                        nb.push(blocks[i]);
                    } else if(blocks[i].y != y) {
                        nb.push(blocks[i]);
                    }
                }
                
                blocks = nb;
                shouldAttack = true;
                
                js('document.getElementById("score" + ' + globalID + ').innerHTML = "Score: ' + (++score) + '";');
                
            }
        }
        
        if(shouldAttack) {
            attackOther();
        }
        
    };
    
    this.draw = function () {
        
        var code = 'ctx.clearRect(0, 0, 512, 320);';
        
        if(block) {
            code += that.drawBlock(block);
        }
        
        for(var i=0; i<blocks.length; i+=1) {
            code += that.drawBlock(blocks[i]);
        }
        
        for(var i=0; i<attackBlocks.length; i+=1) {
            code += that.drawBlock(attackBlocks[i]);
        }
        
        js(code);
        
    };
    
    this.event = function (e) {
        
        if(!block) { return ; }
        
        // Left
        if(e.keyCode == 37) {
            block.x -= 1;
        }
        
        // Rotate
        if(e.keyCode == 38) {
            
        }
        
        // Right
        if(e.keyCode == 39) {
            block.x += 1;
        }
        
    };
    
};
