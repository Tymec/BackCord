require('dotenv').config()
const fs = require('fs');

// Setup discord client and discord backup instance.
const Discord = require("discord.js"),
backup = require("discord-backup"),
config = require('./config/config.json'),
logger = require('./utils/logger'),
client = new Discord.Client(),
cooldowns = new Discord.Collection();

const Scheduler = require('./utils/scheduler');

// Object hash table
const objectTable = {
    backup: backup,
    subscriptions: require("./config/subscriptions.json"),
    memberships: require("./config/memberships.json"),
    scheduler: Scheduler(config.schedulesPath)
};

// Import commands from 'commands' directory.
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// When the discord bot is ready.
client.on("ready", () => {
    //console.log(`Logged in as ${client.user.tag}!`);
    logger.info(`Logged in as ${client.user.tag}.`);
    
    // Set discord-backup storage folder
    backup.setStorageFolder(__dirname + '/backups');
    //console.log("Discord-Backup is ready!");
    logger.info("Discord-backup is ready");
});

// Command Handler
client.on("message", async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot || !message.guild) return;

    // Parse arguments and command name
    let args = message.content.slice(config.prefix.length).split(/ +/);
    let commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

    // Check if command is getting executed in a guild text channel
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    // Check member permissions
    if(command.adminOnly && !message.member.hasPermission("ADMINISTRATOR")){
        return message.channel.send(":x: | You must be an administrator of this server to use this command!");
    }

    // Arguments validator
    /*
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }
    */

    // Cooldown
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    // Fetch required parameters
    let params = {};
    command.params.forEach(param => {
        /*
        try {
            let val = eval(param);
        } catch(err) {
            console.log(err.message);
            continue;
        }
        params[param] = val;
        */
        params[param] = objectTable[param];
    });

    try {
        // Execute command
        command.execute(message, args, params);
    } catch (err) {
        //console.error(err);
        logger.error(err)
        message.reply('Server error while trying to execute command.');
    }
});

client.login(config.token);