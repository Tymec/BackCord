const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'infos',
    description: 'Shows info of a backup.',
    guildOnly: true,
    adminOnly: true,
    cooldown: 86400,
    aliases: [],
    args: true,
    params: ['backup'],
    usage: 'infos <backup id>',
	execute(message, args, params) {
		let backupID = args[0];
        if(!backupID) { return message.channel.send(":x: | You must specify a valid backup ID!"); }

        // Get backup instance
        let backup = params['backup'];

        // Fetch the backup
        backup.fetch(backupID).then((backupInfos) => {
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
            let embed = new MessageEmbed()
                .setAuthor("Backup Informations")
                // Display the backup ID
                .addField("Backup ID", backupInfos.id, false)
                // Displays the server from which this backup comes
                .addField("Server ID", backupInfos.data.guildID, false)
                // Display the size (in mb) of the backup
                .addField("Size", `${backupInfos.size} mb`, false)
                // Display when the backup was created
                .addField("Created at", formatedDate, false)
                .setColor("#FF0000");
            message.channel.send(embed);
        }).catch((err) => {
            // if the backup wasn't found
            return message.channel.send(":x: | No backup found for `" + backupID + "`!");
        });
    }
};