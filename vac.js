controller.hears(['Vacation', 'Left'], ['direct_message', 'direct_mention'], (bot, msg) => {

  var projectId = msg.match[1];
  console.log(projectId);

  bot.api.users.info({user: msg.user}, (error, response) => {

    if (response.user && response.user.real_name) {
    
        bot.reply(msg, 'Hello ' + response.user.real_name + '.  My Sources say this many: ');
		 
		mssql.connect(config).then(function() {
		    
		    new mssql.Request().query('select DaysLeft FROM muzero..Users WHERE UserId = ' + msg.user).then(function(recordset) {
		        bot.reply(msg, recordset[0].DaysLeft);

		    }).catch(function(err) {
		        // ... query error checks 
		    });    
		 });

    } else {
        bot.reply(msg, 'Hello.  ProjectIds');
    }

  });
})