var mysql = require("mysql");

var HOST = "127.0.0.1";
var DB_NAME = "golunch";

var pool = mysql.createPool({
    connectionLimit: 100,
    host: HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: DB_NAME,
    typeCast: function(field, next) {
        if (field.type == 'TINY' && field.length == 1) {
            return (field.string() == '1'); // 1 = true, 0 = false
        } 
        return next();
    }
})

module.exports = pool;