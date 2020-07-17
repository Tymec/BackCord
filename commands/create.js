const config = require('../config/config.json');

module.exports = {
	name: 'create',
    description: 'Creates a backup of the current discord guild.',
    guildOnly: true,
    adminOnly: true,
    cooldown: 86400,
    aliases: [],
    args: false,
    params: ['backup'],
    usage: 'create',
	execute(message, args, params) {
        // Get backup instance
        let backup = params['backup'];

        // Create the backup
        backup.create(message.guild, {
            maxMessagesPerChannel: config.maxMessagesPerChannel,
            jsonBeautify: true
        }).then((backupData) => {
            // And send informations to the backup owner
            message.author.send("The backup has been created! To load it, type this command on the server of your choice: `"+config.prefix+"load "+backupData.id+"`!");
            message.channel.send(":white_check_mark: Backup successfully created. The backup ID was sent in dm!");
        });
    }
};