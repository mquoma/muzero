'use strict';

var MuzeroBot = require('./muzero-bot');

var token = process.env.BOT_API_KEY || 'xoxb-141716574341-zyL1KFMVOsEEzgL7XkBVg9a5';
var name = process.env.BOT_NAME || 'muzerobot' ;

var muzerobot = new MuzeroBot({
    token: token,
    name: name
});

muzerobot.run();
