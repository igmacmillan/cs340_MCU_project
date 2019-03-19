module.exports = function(){
    var express = require('express');
    var router = express.Router();

/******Main Functions********/
// display all Powers
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
// display all weapons using a particular power
 function getWeapons(res, mysql, context, complete, pid){
        mysql.pool.query("SELECT Weapons.wname FROM Weapons\
            INNER JOIN Weapon_Powers ON Weapons.id = Weapon_Powers.wid\
            INNER JOIN Powers ON Weapon_Powers.pid = Powers.id\
            WHERE Powers.id = ?",
            [pid],
            function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.displayweapons = results;
            complete();
        });
    }



/********Drop Boxes***********/
//don't need any

/*******Routing Actions********/
//Display Powers Table
    /*Display all Powers & fills each dropdown box. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["weaponfilter.js"];
        var mysql = req.app.get('mysql');
        getPowerList(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('powers', context);
            }

        }
    });

/*POST route to handle addition of new powers and display weapons using a particular power */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var context = {};
        //handles adding a new power
        if(req.body['new_power']){
            var sql = "INSERT INTO Powers (ability) VALUES (?)";
            var inserts = [req.body.ability];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/powers');
            }
        });
        }
        //displays all weapons using a particular power
        if(req.body['display_weapons']){
           var callbackCount = 0;
            var context = {};
            var mysql = req.app.get('mysql');
            var pid =req.body.id;
            getWeapons(res, mysql, context, complete, pid);
            getPowerList(res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 2){
                    res.render('powers', context);
                }
            }
        }    
    });
    
    return router;
}();