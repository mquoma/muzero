const Botkit = require('botkit');
const mssql = require('mssql');
const connectionFactory = require('./connection-factory');
const config = require('./config')

const controller = Botkit.slackbot();

const proc = controller.spawn({
	  token: process.env.SLACK_TOKEN || 'xoxb-141716574341-BinMV0CPTiG6ZHjIS3x4VE7A'
});

proc.startRTM((err, bot, payload) => {
	if (err) {
 	   console.log(err);
	} else {
    	console.log(bot.identity.id);
    	console.log(bot.identity.name);
    	console.log('Ready.')
  }
});

// controller.on(['direct_message', 'direct_mention'], (bot, msg) => {

//   console.log('reply', msg);

//   if (bot.identity.id == msg.user) {
//     return;
//   }

//   bot.api.users.info({user: msg.user}, (error, response) => {

//     if (response.user && response.user.real_name) {
//         bot.reply(msg, 'Hello ' + response.user.real_name + '!!');
//     } else {
//         bot.reply(msg, 'Hello.');
//     }

//   });

// });

controller.hears('ProjectId (.*)', ['direct_message', 'direct_mention'], (bot, msg) => {

  var projectId = msg.match[1];
  console.log(projectId);

  bot.api.users.info({user: msg.user}, (error, response) => {

    if (response.user && response.user.real_name) {
    
        bot.reply(msg, 'Hello ' + response.user.real_name + '.   Here is what I have on Project Id ' + projectId);
		 
		getProjectById(projectId, function(err, results) {
			if(!err) {
				bot.reply(msg, results[0].Name)
			}
			else {
				console.log(err);
			}
		})

    } else {
        bot.reply(msg, 'Hello.');
    }

  });
});


function getProjectById (projectId, cb) {

    return connectionFactory.getConnection().then(function (conn) {

            var request = new mssql.Request(conn);

            request.input('ProjectId', mssql.Int, projectId);

            request.query('SELECT TOP 1 Name from assess.Project WHERE ProjectID = @ProjectId',
                function (err, recordsets, returnValue) {
                    if (err) {
                        cb('Error in getProject : ' + projectId + ' : ' + err);
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