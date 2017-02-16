const Botkit = require('botkit');

const controller = Botkit.slackbot();

const repo = require('./repo')();

const proc = controller.spawn({
	  token: process.env.SLACK_TOKEN || 'xoxb-141716574341-BinMV0CPTiG6ZHjIS3x4VE7A'
});

proc.startRTM((err, bot, payload) => {
	if (err) {
 	   console.log(err);
	} else {
    	console.log(bot.identity.id);
    	console.log(bot.identity.name);
    	console.log('Ready...')
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

// Get Project Name
controller.hears('ProjectId (.*)', ['direct_message', 'direct_mention'], (bot, msg) => {

  var projectId = msg.match[1];
  console.log(projectId);

  bot.api.users.info({user: msg.user}, (error, response) => {

    if (response.user && response.user.real_name) {
    
        bot.reply(msg, 'Hello ' + response.user.real_name + '.   Here is what I have on Project Id ' + projectId);
		 
		repo.getProjectById(projectId, function(err, results) {
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

// Get Remaining Vacation Days Left
controller.hears(['Vacation', 'Avail'], ['direct_message', 'direct_mention'], (bot, msg) => {

  bot.api.users.info({user: msg.user}, (error, response) => {

    if (response.user && response.user.real_name) {
    
		repo.getUserDaysLeft(msg.user, function(err, results) {
			console.log(results);
			if(!err) {
				bot.reply(msg, 'Hello ' + response.user.real_name + '. You have ' + results[0].DaysAvail + ' vacation days available this year.');
			}
			else {
				console.log(err);
			}
		})

    } else {
        bot.reply(msg, 'Hello.');
    }

  });
})

// Request a Day Off
controller.hears('Take (.) Days off starting on (.*)', ['direct_message', 'direct_mention'], (bot, msg) => {

  bot.api.users.info({user: msg.user}, (error, response) => {

    if (response.user && response.user.real_name) {
    
		repo.getUserDaysLeft(msg.user, function(err, results) {
			console.log(results);
			if(!err) {
				bot.reply(msg, 'Hello ' + response.user.real_name + '. You have ' + results[0].DaysAvail + ' vacation days available this year.');
			}
			else {
				console.log(err);
			}
		})

    } else {
        bot.reply(msg, 'Hello.');
    }

  });
})