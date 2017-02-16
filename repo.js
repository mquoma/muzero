const mssql = require('mssql');
const connectionFactory = require('./connection-factory');
const config = require('./config')

var repo = function () {

    return {

        getProjectById: function (projectId, cb) {

            var sql = 'SELECT TOP 1 Name from assess.Project WHERE ProjectID = @ProjectId';
            var params = [{
                name: 'ProjectId',
                type: mssql.Int,
                value: projectId
            }];

            return executeQuery(sql, params, cb);
        },

        getUserDaysLeft: function (user, cb) {

            var sql = 'SELECT TOP 1 DaysAvail from muzero..Users WHERE UserId = @UserId';
            var params = [{
                name: 'UserId',
                type: mssql.VarChar(255),
                value: user
            }];

            return executeQuery(sql, params, cb);
        },

        getBoss: function (user, cb) {

            var sql = 'SELECT TOP 1 D.UserId AS Director FROM muzero..Directors D JOIN muzero..Users U on U.Department = D.Department AND U.UserId = @UserId';
            var params = [{
                name: 'UserId',
                type: mssql.VarChar(255),
                value: user
            }];

            console.log(sql);
            console.log(params);

            return executeQuery(sql, params, cb);
        },

        requestDaysOff: function (user, day, numDays, cb) {

            var sql = 'INSERT INTO muzero..Requests (UserId, DateRequested, NumDays, RequestStatus) ' +
                'VALUES (@UserId, @DateRequested, @NumDays, @RequestStatus)';
            var params = [{
                name: 'UserId',
                type: mssql.VarChar(255),
                value: user
            }, {
                name: 'DateRequested',
                type: mssql.VarChar(255),
                value: day
            }, {
                name: 'NumDays',
                type: mssql.Int,
                value: numDays
            },{
                name: 'RequestStatus',
                type: mssql.VarChar(255),
                value: 'PENDING'
            }];

            return executeQuery(sql, params, cb);
        }



    }
}

module.exports = repo;

function executeQuery(sql, params, cb) {

    return connectionFactory.getConnection().then(function (conn) {

        var request = new mssql.Request(conn);

        for (var p in params) {
            request.input(params[p].name, params[p].type, params[p].value);

            console.log('params[p].name, params[p].type, params[p].value');
            console.log(params[p].name, params[p].type, params[p].value);
        }
        

        request.query(sql,
            function (err, recordsets, returnValue) {
                if (err) {
                    cb('Error: ' + sql + ' ' + params + ' ' + err);
                }
                else {
                    cb(null, recordsets);
                }
            })
    })
    .catch(function (err) {
        cb(err);
    });
}
            
