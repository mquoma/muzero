const Botkit = require('botkit');

const controller = Botkit.slackbot();

const repo = require('./repo')();

const proc = controller.spawn({
	  token: process.env.SLACK_TOKEN || ''
}).startRTM((err, bot, payload) => {
	if (err) {
 	   console.log(err);
	} else {
    	console.log(bot.identity.id);
    	console.log(bot.identity.name);
    	console.log('Ready...')
  }
});


function appendMention (name) {
	return name.split()[0] != '@' ? '@' + name : name;
}

// Get Project Name
controller.hears('ProjectId (.*)', ['direct_message', 'direct_mention'], (bot, msg) => {

  var projectId = msg.match[1];
  
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


controller.on(['direct_message', 'direct_mention'], (bot, msg) => {

  console.log('tracing', msg);

});

// Get Remaining Vacation Days Left
controller.hears('Vacation (.*) avail', ['direct_message', 'direct_mention'], (bot, msg) => {

  bot.api.users.info({user: msg.user}, (error, response) => {

    if (response.user && response.user.real_name) {
    
		repo.getUserDaysLeft(msg.user, function(err, results) {
			if(!err) {
				bot.reply(msg, 'Hello ' + appendMention(response.user.name) + '. You have ' + results[0].DaysAvail + ' vacation days available this year.');
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

// Request a Day Off
controller.hears('take (.*) days off starting on (.*)', ['direct_message', 'direct_mention'], (bot, msg) => {
  try {
	  var numDays = msg.match[1];
	  var day = msg.match[2];

	  bot.api.users.info({user: msg.user}, (error, response) => {

	    if (response.user && response.user.real_name) {

			repo.getUserDaysLeft(msg.user, function(err, results) {
				if(!err) {
					var daysLeft = results[0].DaysAvail;
					if (daysLeft < numDays) {
						bot.reply(msg, 'Get real,  ' + response.user.real_name + '. You only have ' + daysLeft + ' vacation days left.');
					} else {
						repo.requestDaysOff(msg.user, day, numDays, function(err, results) {
							if(!err) {
								repo.getBoss(msg.user, function(err, results) {
									if(!err) {
										bot.reply(msg, 'OK ' + appendMention(response.user.name) + '.' + 
										'That request has been submitted. ');

										var director = results[0].Director;

										console.log('director', director);

										bot.api.users.info( {user: director}, (error, response) => {
											console.log(response);
											if (response.user) {
												bot.reply(msg, 'Let us notify the boss: ' + appendMention(response.user.name));
											}
										})
									}
								})
								
							}
						})
					}
				}
			})

	    } else {
	        bot.reply(msg, 'Hello? Your identity cannot be verified.');
	    }

	  });
  } catch (ex) {
  	console.log('something went wrong: ' + err);
  }

})