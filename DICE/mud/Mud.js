
function toDir(s) {
    switch(s.toLowerCase()) {
        case "north": return 0;
        case "east": return 1;
        case "south": return 2;
        case "west": return 3;
        default: return null;
    }
};

exports.Mud = function () {
    
    var pls = {};
    var cid = 0;
    
    var rooms = {
        0: new exports.Room(0),
        1: new exports.Room(1),
        2: new exports.Room(2),
        3: new exports.Room(3)
    };
    
    rooms[0].connect(0, rooms[1]);
    rooms[0].connect(3, rooms[2]);
    rooms[0].connect(1, rooms[3]);
    rooms[1].connect(2, rooms[0]);
    rooms[2].connect(1, rooms[0]);
    rooms[3].connect(3, rooms[0]);
    
    rooms[1].items.push("Sword");
    //rooms[3].items.push("Ball");
    rooms[2].items.push("Dagger");
    
    this.newPlayer = function (name) {
        
        var id = cid++;
        
        pls[id] = {
            room: 0,
            items: [],
            name: name,
            hp: 10
        };
        
        return id;
    };
    
    this.removePlayer = function (id) {
        
        pls[id] = null;
        
    };
    
    this.command = function (player, cmd, response) {
        
        var s = cmd.split(" ");
        var p = pls[player];
        
        if(!s) { return ; }
        if(!p) { return ; }
        
        if(p.hp <= 0) {
            response("You're fucking dead!");
            return ;
        }
        
        switch(s[0]) {
            case "go":
            case "walk":
            case "run":
            case "move":
                
                var d = toDir(s[1]);
                
                if(d === null) { response("You can't go that way"); break ; }
                
                var r = rooms[p.room].roomAtDir(d);
                
                if(r === null) { response("You can't go that way"); break; }
                
                p.room = r.id;
                
                response(r.desc());
                this.items(player, response);
                this.players(player, response);
                
                break;
            case 'look':
                
                var r = rooms[p.room];
                
                response(r.desc());
                
                this.items(player, response);
                this.players(player, response);
                
                break;
            case 'take':
                
                var r = rooms[p.room];
                var i = r.items.indexOf(s[1]);
                
                if(i < 0) {
                    response("Can't find that...");
                    break;
                }
                
                p.items.push(r.items.splice(i, 1)[0]);
                response("Picked up " + s[1]);
                
                break;
            case 'drop':
                
                var r = rooms[p.room];
                var i = p.items.indexOf(s[1]);
                
                if(i < 0) {
                    response("Can't find that...");
                    break;
                }
                
                r.items.push(p.items.splice(i, 1)[0]);
                response("Dropped " + s[1]);
                
                break;
            case 'name':
                
                p.name = s[1];
                response("Your name is now " + s[1]);
                
                break;
            case 'hit':
            case 'attack':
                
                var i, op = null;
                
                if(p.items.length == 0) {
                    response("You don't have any weapons, stupid!");
                    break;
                }
                
                for(i=0; i<cid; i++) {
                    if(!pls[i]) { continue; }
                    if(pls[i].name == s[1]) {
                        op = pls[i];
                    }
                }
                
                if(op === null) {
                    response("Can't find that guy");
                    break;
                }
                
                if(op.room != p.room) {
                    response("He isn't in this room");
                    break;
                }
                
                if(op.hp <= 0) {
                    response("You hit a dead guy, he's dead!");
                    break;
                }
                
                if(Math.random() < .5) {
                    response("You missed him!");
                    break;
                }
                
                for(i=0; i<p.items.length; i++) {
                    if(p.items[i] == "Sword") {
                        op.hp -= 3;
                        response("You hit him with a sword");
                        break;
                    }
                    if(p.items[i] == "Dagger") {
                        op.hp -= 1;
                        response("You hit him with a dagger");
                        break;
                    }
                }
                
                if(op.hp <= 0) {
                    response("You killed him!");
                } else {
                    response("He now has " + op.hp + " hp.");
                }
                
                break;
        }
        
    };
    
    this.items = function (player, response) {
        
        var p = pls[player];
        var r = rooms[p.room];
        var i = r.items;
        
        if(i.length == 0) {
            return ;
        }
        
        response("You see the following lying on the ground:");
        
        for(var j=0; j<i.length; j++) {
            response(i[j]);
        }
        
    };
    
    this.players = function (player, response) {
        
        var p = [];
        
        for(var i=0; i<cid; i++) {
            if(!pls[i]) { continue; }
            if(i != player && pls[player].room == pls[i].room) {
                p.push(pls[i])
            }
        }
        
        if(p.length == 0) { return ; }
        
        response("You see the following people:");
        
        for(var i=0; i<p.length; i++) {
            response((p[i].hp <= 0)?"Dead guy on ground":(p[i].name + " (" + p[i].hp + ")"));
        }
        
    };
    
};

exports.Room = function (id) {
    
    this.id = id;
    this.items = [];
    
    var con = [null, null, null, null];
    
    this.connect = function (dir, room) {
        con[dir] = room;
    };
    
    this.roomAtDir = function (dir) {
        return con[dir];
    };
    
    this.desc = function () {
        switch(this.id) {
            case 0: return "You're in a room, there are doors to the north, west and east.";
            case 1: return "You are in the north wing. There is a door to the south.";
            case 2: return "You are in the west wing. There is a door to the east.";
            case 3: return "You are in the east wing. There is a door to the west.";
            default: return "We dont have a fucking clue where you are?";
        }
    }
    
};
