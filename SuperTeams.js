module.exports = function(){
    var express = require('express');
    var router = express.Router();

/******Main Functions********/
// display all Super Teams currently listed
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
    function getTeamDropDown(res, mysql, context, complete){
        mysql.pool.query("SELECT id, tname FROM SuperTeams", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.st = results;
            complete();
        });
    }
/*******Routing Actions********/
//Display Super Teams Table
    /*Display all Super Teams & fills each dropdown box. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteweapon.js"];
        var mysql = req.app.get('mysql');
        getTeamList(res, mysql, context, complete);
        getCharDropDown(res, mysql, context, complete);
        getTeamDropDown(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('teams', context);
            }

        }
    });

    return router;
}();
//Search for super teams

//Add super team

//Add character to super team -- dropdown boxes