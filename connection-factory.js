var mssql = require('mssql');
var config = require('./config');

var connectionPool = null;

exports.getConnection = function(){

    if(connectionPool) return connectionPool;
    return connectionPool = new Promise(function(resolve, reject){
        var conn = new mssql.Connection(config, function(err){
            if(err){
                connectionPool = null;
                return reject(err);
            }
            return resolve(conn);
        })
    })
}
