const config = require('../config/config.json');
const helper = require('../utils/helper');

module.exports = {
	name: 'subscribe',
    description: 'Subscribes you to the backup.',
    guildOnly: true,
    adminOnly: false,
    cooldown: 60,
    aliases: ['signup', 'register'],
    args: false,
    params: ['subscriptions'],
    usage: 'subscribe',
	execute(message, args, params) {
        let guildSubs = params['subscriptions'][message.guild.id];
        let userId = message.author.id;

        if (guildSubs.indexOf(userId) > -1) {
            message.channel.send("Already subscribed!");
            return;
        }

        guildSubs.push(userId);
        params['subscriptions'] = helper.writeFile(config.subscriptionsPath, params['subscriptions']);
        message.channel.send("Sucessfully subscribed!");
    }
};