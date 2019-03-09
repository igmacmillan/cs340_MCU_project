var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_macmilli',
  password        : '9399',
  database        : 'cs340_macmilli'
});
module.exports.pool = pool;