#from discord import Guild, Author, Message, Channel, TextChannel, VoiceChannel, CategoryChannel, Role, Emoji
import discord
from datetime import datetime

class Guild:
    def __init__(self, guild):
        self.attrs = self.parse(guild)
        
    def parse(self, guild):
        attrs = {
            "name": guild.name,
            "afk_timeout": guild.afk_timeout,
            "emojis": [Emoji(x).to_json() for x in guild.emojis],
            "region": str(guild.region),
            "afk_channel": VoiceChannel(guild.afk_channel).to_json(),
            "icon": guild.icon,
            "id": guild.id,
            "banner": guild.banner,
            "description": guild.description,
            "mfa_level": guild.mfa_level,
            "verification_level": str(guild.verification_level),
            "explicit_content_filter": str(guild.explicit_content_filter),
            "default_notifications": str(guild.default_notifications),
            "features": guild.features,
            "splash": guild.splash,
            "discovery_splash": guild.discovery_splash,
            #"channels": [Channel(x).to_json() for x in guild.channels],
            "voice_channels": [VoiceChannel(x).to_json() for x in guild.voice_channels],
            "text_channels": [TextChannel(x).to_json() for x in guild.text_channels],
            "categories": [CategoryChannel(x).to_json() for x in guild.categories],
            "system_channel": TextChannel(guild.system_channel).to_json(),
            "system_channel_flags": {"join": guild.system_channel_flags.join_notifications, "premium": guild.system_channel_flags.premium_subscriptions},
            "rules_channel": TextChannel(guild.rules_channel).to_json(),
            "public_updates_channel": TextChannel(guild.public_updates_channel).to_json(),
            "members": [Member(x).to_json() for x in guild.members],
            "premium_subscribers": [Member(x).to_json() for x in guild.premium_subscribers],
            "roles": [Role(x).to_json() for x in guild.roles],
            "owner": Member(guild.owner).to_json(),
            "icon_url": Asset(guild.icon_url).to_json(),
            "is_icon_animated": guild.is_icon_animated(),
            "banner_url": Asset(guild.banner_url).to_json(),
            "splash_url": Asset(guild.splash_url).to_json(),
            "discovery_splash_url": Asset(guild.discovery_splash_url).to_json(),
            "created_at": guild.created_at.strftime("%m/%d/%Y, %H:%M:%S")
        }
        
        return atts
        
    def to_json(self):
        return self.attrs

class Asset:
    def __init__(self, asset):
        self.attrs = self.parse(asset)
        
    def parse(self, asset):
        attrs = {
            "url": str(asset)
        }
        return attrs
        
    def to_json(self):
        return self.attrs

class Member:
    def __init__(self, member):
        self.attrs = self.parse(member)
        
    def parse(self, member):
        attrs = {
            "full_name": str(member),
            "nick": member.nick,
            "color": str(member.color),
            "roles": [Role(x).to_json() for x in member.roles],
            "display_name": member.display_name,
            "avatar_url": Asset(member.avatar_url).to_json(),
            "bot": member.bot,
            "discriminator": member.discriminator,
            "id": member.id,
            "is_avatar_animated": member.is_avatar_animated(),
            "name": member.name
        }
        
        return attrs
        
    def to_json(self):
        return self.attrs

class Message:
    def __init__(self, message):
        self.attrs = self.parse(message)
        
    def parse(self, message):
        attrs = {
            "tts": message.tts,
            "type": str(message.type),
            "author": Member(message.author).to_json(),
            "content": message.content,
            "embeds": [Embed(x).to_json() for x in message.embeds],
            "channel": TextChannel(message.channel).to_json(),
            "mentions": [Member(x).to_json() for x in message.mentions],
            #"channel_mentions": [Channel(x).to_json() for x in message.channel_mentions],
            "role_mentions": [Role(x).to_json() for x in message.role_mentions],
            "id": message.id,
            "webhook_id": message.webhook_id,
            "attachments": [Attachment(x).to_json() for x in message.attachments],
            "pinned": message.pinned,
            "flags": {"crossposted": message.flags.crossposted, "is_crossposted": message.flags.is_crossposted, "suppress_embeds": message.flags.suppress_embeds, "source_message_deleted": message.flags.source_message_deleted, "urgent": message.flags.urgent},
            "reactions": [Reaction(x).to_json() for x in message.reactions],
            "activity": message.activity,
            "application": message.application,
            "raw_mentions": message.raw_mentions,
            "raw_channel_mentions": message.raw_channel_mentions,
            "raw_role_mentions": message.raw_role_mentions,
            "clean_content": message.clean_content,
            "created_at": message.created_at.strftime("%m/%d/%Y, %H:%M:%S"),
            "edited_at": message.edited_at.strftime("%m/%d/%Y, %H:%M:%S"),
            "jump_url": message.jump_url,
            "is_system": message.is_system()
        }
        
        return attrs
        
    def to_json(self):
        return self.attrs

class Reaction:
    def __init__(self, reaction):
        self.attrs = self.parse(reaction)
        
    def parse(self, reaction):
        attrs = {
            "emoji": [Emoji(x).to_json() for x in reaction.emoji],
            "count": reaction.count,
            "message": Message(reaction.message),
            "custom_emoji": reaction.custom_emoji
        }
        
        return attrs
        
    def to_json(self):
        return self.attrs

class Attachment:
    def __init__(self, attachment):
        self.attrs = self.parse(attachment)
        
    def parse(self, attachment):
        attrs = {
            "id": attachment.id,
            "size": attachment.size,
            "height": attachment.height,
            "width": attachment.width,
            "filename": attachment.filename,
            "url": attachment.url,
            "proxy_url": attachment.proxy_url,
            "is_spoiler": attachment.is_spoiler()
        }
        
        return attrs
        
    def to_json(self):
        return self.attrs

class Embed:
    def __init__(self, embed):
        self.attrs = self.parse(embed)
        
    def parse(self, embed):
        attrs = {
            "len": len(embed),
            "title": embed.title,
            "type": embed.type,
            "description": embed.description,
            "url": embed.url,
            "timestamp": embed.timestamp.strftime("%m/%d/%Y, %H:%M:%S"),
            "colour": str(embed.colour),
            "footer": {"text": embed.footer.text, "icon_url": embed.footer.icon_url},
            "image": {"url": embed.image.url, "proxy_url": embed.image.proxy_url, "width": embed.image.width, "height": embed.image.height},
            "thumbnail": {"url": embed.thumbnail.url, "proxy_url": embed.thumbnail.proxy_url, "width": embed.thumbnail.width, "height": embed.thumbnail.height},
            "video": {"url": embed.video.url, "height": embed.video.height, "width": embed.video.width},
            "provider": {"name": embed.provider.name, "url": embed.provider.url},
            "author": {"name": embed.author.name, "url": embed.author.url, "icon_url": embed.author.icon_url},
            "fields": [{"name": x.name, "value": x.value, "inline": x.inline} for x in embed.fields]
        }
        
        #return embed.to_dict()
        return attrs
        
    def to_json(self):
        return self.attrs

class TextChannel:
    def __init__(self, text_channel):
        self.attrs = self.parse(text_channel)
        
    def parse(self, text_channel):
        attrs = {}
        
        return attrs
        
    def to_json(self):
        return self.attrs

class VoiceChannel:
    def __init__(self, voice_channel):
        self.attrs = self.parse(voice_channel)
        
    def parse(self, voice_channel):
        attrs = {}
        
        return attrs
        
    def to_json(self):
        return self.attrs
        
class Category:
    def __init__(self, category):
        self.attrs = self.parse(category)
        
    def parse(self, category):
        attrs = {
            "name": category.name,
            "id": category.id,
            "position": category.position,
            "is_nsfw": category.is_nsfw(),
            #"channels": [Channel(x).to_json() for x in category.channels],
            "text_channels": [TextChannel(x).to_json() for x in category.text_channels],
            "voice_channels": [VoiceChannel(x).to_json() for x in category.voice_channels],
            "changed_roles": [Role(x).to_json() for x in category.changed_roles],
            "created_at": category.created_at.strftime("%m/%d/%Y, %H:%M:%S"),
            "overwrites": []
        }
        
        return attrs
        
    def to_json(self):
        return self.attrs

class Role:
    def __init__(self, role):
        self.attrs = self.parse(role)
        
    def parse(self, role):
        attrs = {
            "name": role.name,
            "id": role.id,
            "hoist": role.hoist,
            "position": role.position,
            "managed": role.managed,
            "mentionable": role.mentionable,
            "is_default": role.is_default(),
            "permissions": Permissions(role.permissions).to_json(),
            "colour": str(role.colour),
            "created_at": role.created_at.strftime("%m/%d/%Y, %H:%M:%S"),
            "members": [Member(x).to_json() for x in role.members]
        }
        
        return attrs
        
    def to_json(self):
        return self.attrs
      
class Permissions:
    def __init__(self, permissions):
        self.attrs = self.parse(permissions)
        
    def parse(self, permissions):
        attrs = {
            "value": permissions.value,
            "permissions": {
                "create_instant_invite": permissions.create_instant_invite,
                "kick_members": permissions.kick_members,
                "ban_members": permissions.ban_members,
                "administrator": permissions.administrator,
                "manage_channels": permissions.manage_channels,
                "manage_guild": permissions.manage_guild,
                "add_reactions": permissions.add_reactions,
                "view_audit_log": permissions.view_audit_log,
                "priority_speaker": permissions.priority_speaker,
                "stream": permissions.stream,
                "read_messages": permissions.read_messages,
                "view_channel": permissions.view_channel,
                "send_messages": permissions.send_messages,
                "send_tts_messages": permissions.send_tts_messages,
                "manage_messages": permissions.manage_messages,
                "embed_links": permissions.embed_links,
                "attach_files": permissions.attach_files,
                "read_message_history": permissions.read_message_history,
                "mention_everyone": permissions.mention_everyone,
                "external_emojis": permissions.external_emojis,
                "view_guild_insights": permissions.view_guild_insights,
                "connect": permissions.connect,
                "speak": permissions.speak,
                "mute_members": permissions.mute_members,
                "deafen_members": permissions.deafen_members,
                "move_members": permissions.move_members,
                "use_voice_activation": permissions.use_voice_activation,
                "change_nickname": permissions.change_nickname,
                "manage_nicknames": permissions.manage_nicknames,
                "manage_roles": permissions.manage_roles,
                "manage_permissions": permissions.manage_permissions,
                "manage_webhooks": permissions.manage_webhooks,
                "manage_emojis": permissions.manage_emojis
            }
        }
        
        return attrs
        
    def to_json(self):
        return self.attrs
      
class Emoji:
    def __init__(self, emoji):
        self.attrs = self.parse(emoji)
        
    def parse(self, emoji):
        attrs = {
            "name": emoji.name,
            "id": emoji.id,
            "require_colons": emoji.require_colons,
            "animated": emoji.animated,
            "managed": emoji.managed,
            "url": Asset(emoji.url).to_json(),
            "roles": [Role(x).to_json() for x in emoji.roles]
        }
        
        return attrs

    def to_json(self):
        return self.attrs
