const Botkit = require('botkit');

const controller = Botkit.slackbot();

const proc = controller.spawn({
	  token: process.env.SLACK_TOKEN || 'xoxb-141716574341-fJse3NfJOTRvvEOpZuv8kgl2'
});

proc.startRTM((err, bot, payload) => {
	if (err) {
    console.log('Could not connect to Slack');
    throw new Error('Could not connect to Slack');
	} else {
    console.log(bot.identity.id);
    console.log(bot.identity.name);
    console.log('Ready.')
  }
});

controller.on(['direct_message', 'direct_mention'], (bot, msg) => {

  console.log('reply', msg);

  if (bot.identity.id == msg.user) {
    return;
  }

  bot.api.users.info({user: msg.user}, (error, response) => {

    if (response.user && response.user.real_name) {
        bot.reply(msg, 'Hello ' + response.user.real_name + '!!');
    } else {
        bot.reply(msg, 'Hello.');
    }

  });

});


controller.hears('ProjectId (.*)', ['direct_message', 'direct_mention'], (bot, msg) => {

  var projectId = msg.match[1];
  console.log(projectId);

  bot.api.users.info({user: msg.user}, (error, response) => {

    if (response.user && response.user.real_name) {
        bot.reply(msg, 'Hello ' + response.user.real_name + '.   Let us talk about Project Ids');
    } else {
        bot.reply(msg, 'Hello.  ProjectIds');
    }

  });
})
