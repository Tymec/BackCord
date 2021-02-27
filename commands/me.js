const config = require('../config/config.json');

module.exports = {
	name: 'me',
    description: 'Backups user.',
    guildOnly: true,
    adminOnly: false,
    cooldown: 60,
    aliases: [],
    args: true,
    params: [],
    usage: 'me',
	execute(message, args, params) {
        let user = message.author;
        // Get username
        let userName = user.tag;
        // Get user avatar
        let userAvatar = user.avatarURL();
        // Get user gifs (manual): send instructions
        let gifsInstructions = `\`\`\`md
        To backup your favorite gifs do:
            1. Enable "Developer Mode" in 'Settings/Appearance'.
            2. Press "Ctrl+Shift+I" and go to the 'Application' tab.
            3. Go to 'Local Storage/discord.com' and find "GIFFavoritesStore".
            4. Copy and paste the value to a text file.
        \`\`\``
        message.channel.send(gifsInstructions);
        message.channel.send(`Username: ${userName} | Avatar URL: ${userAvatar}`);
    }
};