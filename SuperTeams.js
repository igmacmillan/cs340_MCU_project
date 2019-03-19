module.exports = function(){
    var express = require('express');
    var router = express.Router();

/******Main Functions********/
// display all Teams currently listed
    function getTeamList(res, mysql, context, complete){
        mysql.pool.query("SELECT SuperTeams.id, tname, alignment FROM SuperTeams", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams = results;
            complete();
        });
    }
//display SuperTeam & Hero List
    function getHeroTeamList(res, mysql, context, complete){
        mysql.pool.query("SELECT hname AS Hero, tname AS SuperTeam \
            FROM Characters\
            INNER JOIN Character_SuperTeams ON Characters.id = Character_SuperTeams.cid\
            INNER JOIN SuperTeams ON SuperTeams.id = Character_SuperTeams.sid\
            ORDER BY Characters.hname", function(error, results, fields){
             if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.hero_teams = results;
            complete();
        });
    }

/********Drop Boxes***********/
//Character
/*Fills in dropdown box for selecting a character*/
    function getCharDropDown(res, mysql, context, complete){
        mysql.pool.query("SELECT id, fname, lname, hname FROM Characters", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.chars  = results;
            complete();
        });
    }
//SuperTeam
/*Fills in dropdown box for selecting a SuperTeam*/
/*    function getTeamDropDown(res, mysql, context, complete){
        mysql.pool.query("SELECT id, tname FROM SuperTeams", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams = results;
            complete();
        });
    }*/
/*******Routing Actions********/
//Display Super Teams Table
    /*Display all Super Teams & fills each dropdown box. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteweapon.js"];
        var mysql = req.app.get('mysql');
        getTeamList(res, mysql, context, complete);
        getHeroTeamList(res, mysql, context, complete);
        getCharDropDown(res, mysql, context, complete);
        /*getTeamDropDown(res, mysql, context, complete);*/
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('teams', context);
            }

        }
    });

//Add SuperTeam
  /* Adds a SuperTeam then redirects to the SuperTeams page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        if(req.body['new_team']){
            var sql = "INSERT INTO SuperTeams (tname, alignment) VALUES (?,?)";
            var inserts = [req.body.tname, req.body.alignment];
        }
        if(req.body['new_char_team']){
            var sql = "INSERT INTO Character_SuperTeams (cid, sid) VALUES (?,?)";
            var inserts = [req.body.cid, req.body.id]; 
        }
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/teams');
            }
        });
    });

    return router;
}();