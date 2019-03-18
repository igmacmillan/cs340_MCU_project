module.exports = function(){
    var express = require('express');
    var router = express.Router();

/******Main Functions********/
// display all Weapons currently listed
    function getWeaponList(res, mysql, context, complete){
        mysql.pool.query("SELECT Weapons.id, wname FROM Weapons", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.weapons = results;
            complete();
        });
    }

// return all current powers
    function getPowerList(res, mysql, context, complete){
        mysql.pool.query("SELECT Powers.id, ability FROM Powers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.powers = results;
            complete();
        });
    }

 // Display all Character to Weapons combinations
 function getPowerWeaponList(res, mysql, context, complete){
        mysql.pool.query("SELECT ability, wid, pid, wname FROM Powers \
            INNER JOIN Weapon_Powers ON Powers.id = Weapon_Powers.pid \
            INNER JOIN Weapons ON Weapons.id = Weapon_Powers.wid \
            ORDER BY wname", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.weap_pow = results;
            complete();
        });
    }


/*******Routing Actions********/
//Display Weapons Table
    /*Display all Weapons & fills each dropdown box. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteweaponpower.js"];
        var mysql = req.app.get('mysql');
        getWeaponList(res, mysql, context, complete);
        getPowerList(res, mysql, context, complete);
        getPowerWeaponList(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('weapons', context);
            }

        }
    });


//search for weapon

//add weapon and add power to weapon
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        if(req.body['new_weapon']){  
            var sql = "INSERT INTO Weapons (wname) VALUES (?)";
            var inserts = [req.body.wname];
        }   
        
         if(req.body['new_weapon_power']){  
            var sql = "INSERT INTO Weapon_Powers (wid, pid) VALUES (?,?)";
            var inserts = [req.body.id, req.body.pid];    
        } 

        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/weapons');
            }
        });
           
    });
   /* Route to delete a weapon power relationship, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:wid/:pid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Weapon_Powers WHERE wid = ? AND pid = ?";
        var inserts = [req.params.wid, req.params.pid];
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