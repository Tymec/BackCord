const config = require('../config/config.json');

module.exports = {
	name: 'reload',
    description: 'Reloads a command',
    devOnly: true,
    guildOnly: true,
    adminOnly: true,
    cooldown: 5,
    aliases: [],
    args: true,
    params: [],
    usage: 'reload <command>',
	execute(message, args, params) {
        if (message.author.id != "289790955459182592") { return message.channel.send(`Developer only command...`); }

		if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${command.name}\` was reloaded!`);
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
        
        
	},
};