'use strict';

var MuzeroBot = require('./muzero-bot');

var token = process.env.BOT_API_KEY || '';
var name = process.env.BOT_NAME || 'muzerobot' ;

var muzerobot = new MuzeroBot({
    token: token,
    name: name
});

muzerobot.run();
