const { MessageAttachment } = require('discord.js');
var os = require('os');
var path = require('path');
var fs = require('fs');
var request = require('request');
const config = require('../config/config.json');

module.exports = {
	name: 'togif',
    description: 'Converts image to gif (lets you add it to favorite gifs).',
    guildOnly: true,
    adminOnly: true,
    cooldown: 60,
    aliases: [],
    args: true,
    params: [],
    usage: 'togif',
	execute(message, args, params) {
        let channel = message.channel;
        channel.messages.fetch({ limit: 10 })
            .then(messages => {
                let prevMedia = messages.filter(m => m.attachments.size > 0 || m.embeds.length > 0);
                if (prevMedia.size === 0) {
                    channel.send(":x: No image was specified. :x:");
                    return;
                }

                // Check if embed or attachment (only first embed or attachment)
                let latestMedia = prevMedia.first();
                let url;
                if (latestMedia.embeds.length > 0) {
                    // Embed
                    url = latestMedia.embeds[0].url;
                } else if (latestMedia.attachments.size > 0) {
                    // Attachment
                    url = latestMedia.attachments.first().url;
                } else {
                    // Broke
                    url = "https://i.imgur.com/zsl18Tq.jpg";
                    message.channel.send(`text`, new MessageAttachment(url));
                    return;
                }

                // Download image, convert to gif then upload back
                let filePath;
                fs.mkdtemp(path.join(os.tmpdir(), 'backcord-'), (err, folder) => {
                    request.head(url, function(err, res, body) {
                        filePath = path.join(folder, 'togif.gif')
                        request(url).pipe(fs.createWriteStream(filePath)).on('close', () => {
                            message.channel.send('We Like Fortnite', { files: [filePath] });
                        });
                    });
                });
                
            })
            .catch(console.error);
    }
};