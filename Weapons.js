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

/*******Routing Actions********/
//Display Weapons Table
    /*Display all Weapons & fills each dropdown box. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteweapon.js"];
        var mysql = req.app.get('mysql');
        getWeaponList(res, mysql, context, complete);
        getPowerList(res, mysql, context, complete)
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
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
//add power to weapon --dropdown boxes

    return router;
}();