'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');

var Bot = require('slackbots');


class MuzeroBot extends Bot {
  constructor (settings) {
    super(settings);
  }
}

MuzeroBot.prototype.run = function () {
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

MuzeroBot.prototype._onStart = function () {
    this._loadBotUser();
    this._welcomeMessage();
};

MuzeroBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

MuzeroBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, 'Welcome, Muzero fans!' +
        '\n Type MuzeroBot of `' + this.name + '` to invoke me.',
        {as_user: true});
};

MuzeroBot.prototype._onMessage = function (message) {
    console.log('message.type ->');
    if (message.type === 'presence_change') {
        console.log(message);
    }
    
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromMuzeroBot(message) &&
        this._isMentioningMuzeroBot(message)
    ) {
        this._replyWithRandomMessage(message);
    }
};

MuzeroBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && message.text;
};

MuzeroBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

MuzeroBot.prototype._isFromMuzeroBot = function (message) {
    return message.user === this.user.id;
};

MuzeroBot.prototype._isMentioningMuzeroBot = function (message) {
    return message.text.toLowerCase().indexOf('muzero bot') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

MuzeroBot.prototype._replyWithRandomMessage = function (originalMessage) {
    var self = this;
    var channel = self._getChannelById(originalMessage.channel);
    self.postMessageToChannel(channel.name, 'random message', {as_user: true});
};

MuzeroBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

module.exports = MuzeroBot;
