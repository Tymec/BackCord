const config = require('../config/config.json');
const helper = require('../utils/helper');

module.exports = {
	name: 'unsubscribe',
    description: 'Unsubscribes you from the backup.',
    guildOnly: true,
    adminOnly: false,
    cooldown: 60,
    aliases: ['unregister'],
    args: false,
    params: ['subscriptions'],
    usage: 'unsubscribe',
	execute(message, args, params) {
        let guildSubs = params['subscriptions'][message.guild.id];
        let userId = message.author.id;

        if (guildSubs.indexOf(userId) === -1) {
            message.channel.send("Not subscribed!");
            return;
        }

        guildSubs.pop(userId);
        params['subscriptions'] = helper.writeFile(config.subscriptionsPath, params['subscriptions']);
        message.channel.send("Sucessfully unsubscribed!");
    }
};