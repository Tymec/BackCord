const config = require('../config/config.json');
const helper = require('../utils/helper');
const logger = require('../utils/logger');

module.exports = {
	name: 'setup',
    description: 'Initiates the bot for a server.',
    guildOnly: true,
    adminOnly: true,
    cooldown: 120,
    aliases: ['start', 'run', 'schedule'],
    args: true,
    params: ['memberships', 'scheduler'],
    usage: 'setup <yearly/monthly/weekly/daily>',
	execute(message, args, params) {
        let schedule = args[0];

        // Check user's tier
        let isAllowed = helper.checkPermission(params['memberships'], message.author.id, "schedule", schedule);
        let userTier = helper.getUserTier(params['memberships'], message.author.id);
        if (!isAllowed) {
            message.channel.send(`Not allowed to use schedule \`${schedule}\` with tier \`${userTier}\``);
            return;
        }

        let webhook = {};
        const newWebhook = message.channel.createWebhook("Backup Webhook", {})
            .then((_webhook) => {
                webhook['id'] = _webhook.id;
                webhook['token'] = _webhook.token
                logger.info(`Created webhook with ID ${_webhook.id}`);
            }).catch((err) => {
                logger.error(err);
            }); 

        let scheduler = params['scheduler'];
        scheduler.add(message.guild.id, schedule, webhook);
        message.channel.send(`Started schedule \`${schedule}\`.`);
    }
};