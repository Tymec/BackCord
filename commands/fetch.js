const config = require('../config/config.json');

module.exports = {
	name: 'fetch',
    description: 'Fetches everything from a channel and saves it in a .zip file.',
    guildOnly: true,
    adminOnly: true,
    cooldown: 60,
    aliases: [],
    args: true,
    params: [],
    usage: 'fetch <limit>',
	execute(message, args, params) {
    }
};