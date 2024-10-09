var mysql = require("mysql2");

var connection = mysql.createConnection({
    host: '127.0.0.1',
    database: 'test',
    user: 'root',
    password: '1234'
});

module.exports = connection;