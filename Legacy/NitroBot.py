import requests
from os import path, mkdir, getcwd
import ujson as json
import discord
import asyncio
import aiohttp
from discord.ext.commands import Bot
from discord.ext import commands
from secrets import DISCORD_TOKEN

class Helper:
    @staticmethod
    def download_resource(asset_type, asset_cdn):
        asset_id = 0
        return asset_id
    
    @staticmethod
    def send_webhook_message(url, content, username, avatar):
        data = {
            'content': content,
            'username': username,
            'avatar_url': avatar,
            'embeds': [{}]
        }
        headers = {
            'Content-Type': 'application/json'
        }
        
        response = requests.post(url, data=json.dumps(data), headers=headers)
        
        try:
            response.raise_for_status()
        except requests.exceptions.HTTPError as err:
            print(err)
        else:
            print("Payload delivered successfully, code {}.".format(result.status_code))
    
    @staticmethod
    def init_backup(name):
        backup_dir = f"res/{name}/"
        mkdir(backup_dir)
        mkdir(backup_dir + 'avatars')
        mkdir(backup_dir + 'messages')
        mkdir(backup_dir + 'media')
        return backup_dir
 
bot = Bot('!!')
bot.remove_command('help')

@bot.event
async def on_ready():
    #await bot.change_presence()
    print('Logged in as')
    print(bot.user.name)
    print(bot.user.id)
    print('------')

@bot.command()
async def getemoji(ctx, emoji: discord.Emoji):
    #url = "https://cdn.discordapp.com/emojis/{}"
    #print(emoji.id)
    return

@bot.command(
    name="restore",
    description="Restores server",
    pass_context=True
)
async def restore_cmd(ctx):
    #async with aiohttp.ClientSession() as session:
    #    webhook = Webhook.from_url('url-here', adapter=AsyncWebhookAdapter(session))
    #    await webhook.send('Hello World', username='Foo')
    return

@bot.command(
    name="backup",
    description="Backups server",
    pass_context=True
)
async def backup_cmd(ctx):
    backup = {}

    guild = ctx.guild
    
    backup['guild'] = {
        "name": guild.name,
        "afk_timeout": guild.afk_timeout,
        "afk_channel": guild.afk_channel.name,
        "icon": str(guild.icon_url)
    }
    print(guild.region)
    
    backup['channels'] = {}
    
    # Text Channels
    text_channels = []
    for text_channel in guild.text_channels:
        text_channel_dict = {
            "name": text_channel.name,
            "topic": text_channel.topic,
            "position": text_channel.position,
            "nsfw": text_channel.is_nsfw(),
            "id": text_channel.id
        }
        
        if text_channel.category:
            text_channel_dict["category"] = text_channel.category.name
        
        text_channel_dict['pins'] = []
        pinned_messages = await text_channel.pins()
        for pins in pinned_messages:
            text_channel_dict['pins'].append(pins.id)
        
        text_channel_dict['messages'] = []
        message_history = await text_channel.history(limit=100, oldest_first=True).flatten()
        for message in message_history:
            msg = {
                'content': message.content,
                'nickname': message.author.display_name,
                'color': message.author.color.value,
                'avatar': str(message.author.avatar_url),
                'id': message.id
            }
            
            msg['attachments'] = []
            for attachement in message.attachments:
                msg['attachments'].append(attachement.url)
            
            
            text_channel_dict['messages'].append(msg)
        text_channels.append(text_channel_dict)
    backup['channels']['text'] = text_channels
    
    # Voice Channels
    voice_channels = []
    for voice in guild.voice_channels:
        voice_channel = {
            "name": voice.name,
            "category": voice.category.name,
            "position": voice.position,
            "bitrate": voice.bitrate,
            "user_limit": voice.user_limit,
            "id": voice.id
        }
        
        voice_channels.append(voice_channel)
    backup['channels']['voice'] = voice_channels
        
    # Categories
    categories = []
    for category in guild.categories:
        category_dict = {
            "name": category.name,
            "position": category.position,
            "id": category.id
        }
        
        category_dict["channels"] = []
        for channel in category.channels:
            category_dict["channels"].append(channel.id)

    backup['channels']['category'] = categories

    # Members
    members = []
    for member in guild.members:
        member_dict = {
            "nick": member.nick,
            
        }
        
        members.append(member_dict)
        
    backup['members'] = members
        
    # Roles
    roles = []
    for role in guild.roles:
        role_dict = {
            "id": role.id,
            "name": role.name,
            "hoist": role.hoist,
            "position": role.position,
            "mentionable": role.mentionable,
            "color": role.color.value
        }
        
        roles.append(role_dict)
        
    backup['roles'] = roles
        
    # Emojis
    emojis = {}
    for emoji in guild.emojis:
        pass
   
    backup['emojis'] = emojis
    
    with open('x.json', 'w') as f:
        json.dump(backup, f, indent=4)
        
    await ctx.channel.send("Done!")

@bot.command(
    name="help",
    description="Shows this message",
    pass_context=True
)
async def help_cmd(ctx):
    channel = ctx.message.channel

    message = (
        "```\n"
        "​Commands:\n"
        "   help:           Shows this message\n"
        "\n"
        "Usage:\n"
        "   help:           !!help\n"
        "\n"
        "Type !!help command for more info on a command.\n"
        "```"
    )
    await channel.send(message)

bot.run(DISCORD_TOKEN)