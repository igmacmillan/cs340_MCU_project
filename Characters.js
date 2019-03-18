module.exports = function(){
    var express = require('express');
    var router = express.Router();
/******Main Functions********/

// display all characters from Characters table
    function getCharacterList(res, mysql, context, complete){
        mysql.pool.query("SELECT Characters.id, fname, lname, hname, race FROM Characters", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.chars = results;
            complete();
        });
    }
// Display all Character to Weapons combinations
 function getCharWeapList(res, mysql, context, complete){
        mysql.pool.query("SELECT hname AS Hero, Character_Weapons.wid, wname AS Weapon FROM Characters \
            INNER JOIN Character_Weapons ON Characters.id = Character_Weapons.cid \
            INNER JOIN Weapons ON Weapons.id = Character_Weapons.wid \
            ORDER BY hname", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.char_weap = results;
            complete();
        });
    }

//display Character Powers
    function getCharPowList(res, mysql, context, complete){
        mysql.pool.query("SELECT hname AS Hero, ability AS Power, Character_Powers.pid\
            FROM Characters\
            INNER JOIN Character_Powers ON Characters.id = Character_Powers.cid\
            INNER JOIN Powers ON Powers.id = Character_Powers.pid\
            ORDER BY hname", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.char_with_powers = results;
            complete();
        });
    }


// search for character by hero name - text fill in box
    function getCharbyHeroName(req, res, mysql, context, complete){
      var query = "SELECT Characters.id, fname, lname, hname, race FROM Characters WHERE Characters.hname = ?";
      var inserts = [req.params.hname];
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.chars = results;
            complete();
        });
    }

/*Select a Character for Updating and Deleting*/ 
    function getCharacter(res, mysql, context, id, complete){
        var sql = "SELECT Characters.id, fname, lname, hname, race FROM Characters WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.chars = results[0];
            complete();
        });
    }


/********Drop Boxes***********/
//Character
/*Fills in dropdown box for selecting a character*/
    function getCharDropDown(res, mysql, context, complete){
        mysql.pool.query("SELECT id, hname FROM Characters", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.chars  = results;
            complete();
        });
    }

//Power
/*Fills in dropdown box for selecting a power*/
    function getPowerDropDown(res, mysql, context, complete){
        mysql.pool.query("SELECT id, ability FROM Powers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.powers = results;
            complete();
        });
    }
//Weapon
/*Fills in dropdown box for selecting a weapon*/
    function getWeaponDropDown(res, mysql, context, complete){
        mysql.pool.query("SELECT id, wname FROM Weapons", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.weapons = results;
            complete();
        });
    }

/*******Routing Actions********/
//Display Table
    /*Display all Characters & fills each dropdown box. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletechar.js"];
        var mysql = req.app.get('mysql');
        getCharacterList(res, mysql, context, complete);
        getCharWeapList(res, mysql, context, complete);
        getCharPowList(res, mysql, context, complete);
        getPowerDropDown(res, mysql, context, complete);
        getWeaponDropDown(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 5){
                res.render('characters', context);
            }

        }
    });


//Add Character
  /* Adds a character, redirects to the chars page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        if(req.body['new_char']){
            var sql = "INSERT INTO Characters (fname, lname, hname, race) VALUES (?,?,?,?)";
            var inserts = [req.body.fname, req.body.lname, req.body.hname, req.body.race];
        }
        if(req.body['new_char_weapon']){
            var sql = "INSERT INTO Character_Weapons (cid, wid) VALUES (?,?)";
            var inserts = [req.body.id, req.body.wid]; 
        }
        if(req.body['new_char_power']){
            var sql = "INSERT INTO Character_Powers (cid, pid) VALUES (?,?)";
            var inserts = [req.body.id, req.body.pid];  
        }

        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/characters');
            }
        });
    });

//Update Character Info
 /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatechar.js"];
        var mysql = req.app.get('mysql');
        getCharacter(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-char', context);
            }

        }
    });

 
    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Characters SET fname=?, lname=?, hname=?, race=? WHERE id=?";
        var inserts = [req.body.fname, req.body.lname, req.body.hname, req.body.race, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

//Remove Char
    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Characters WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();