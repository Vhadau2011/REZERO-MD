const { ChannelType, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'creatzz',
    category: 'utility',
    description: 'Creates a server structure with 30 channels using decorative fonts',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ You need Administrator permissions to use this command!');
        }

        const guild = message.guild;
        message.reply('🏗️ Starting server creation process with 30 decorative channels... This will take a moment.');

        try {
            const categories = [
                { 
                    name: '╭・👑 ANNOUNCEMENTS', 
                    channels: [
                        { name: '┃・📢-news', type: ChannelType.GuildAnnouncement },
                        { name: '┃・📢-updates', type: ChannelType.GuildAnnouncement },
                        { name: '┃・📢-events', type: ChannelType.GuildAnnouncement },
                        { name: '┃・📢-alerts', type: ChannelType.GuildAnnouncement },
                        { name: '╰・📢-community', type: ChannelType.GuildAnnouncement }
                    ] 
                },
                { 
                    name: '╭・💬 PUBLIC CHATS', 
                    channels: [
                        { name: '┃・💬-general' },
                        { name: '┃・💬-media' },
                        { name: '┃・💬-memes' },
                        { name: '┃・💬-gaming' },
                        { name: '╰・💬-off-topic' }
                    ] 
                },
                { 
                    name: '╭・🎰 GAMBLING AREA', 
                    channels: [
                        { name: '┃・💳-registration' },
                        { name: '┃・🎰-gamble-1' },
                        { name: '┃・🎰-gamble-2' },
                        { name: '┃・🎰-gamble-3' },
                        { name: '┃・🏆-leaderboard' },
                        { name: '╰・🏪-shop' }
                    ] 
                },
                { 
                    name: '╭・🔊 VOICE CHATS', 
                    channels: [
                        { name: '┃・🔊-General-VC', type: ChannelType.GuildVoice },
                        { name: '┃・🔊-Gaming-VC', type: ChannelType.GuildVoice },
                        { name: '┃・🔊-Music-VC', type: ChannelType.GuildVoice },
                        { name: '┃・🔊-Chill-VC', type: ChannelType.GuildVoice },
                        { name: '┃・🔊-Streaming', type: ChannelType.GuildVoice },
                        { name: '╰・💤-AFK', type: ChannelType.GuildVoice }
                    ] 
                },
                { 
                    name: '╭・🛡️ STAFF ONLY', 
                    private: true,
                    channels: [
                        { name: '┃・🛡️-owner-hq' },
                        { name: '┃・🛡️-admin-chat' },
                        { name: '┃・🛡️-mod-chat' },
                        { name: '╰・🛡️-logs' }
                    ] 
                },
                { 
                    name: '╭・🎫 SUPPORT', 
                    channels: [
                        { name: '┃・🎫-open-ticket' },
                        { name: '┃・❓-faq' },
                        { name: '┃・🛠️-help-desk' },
                        { name: '╰・📝-suggestions' }
                    ] 
                }
            ];

            // Total channels check: 5 + 5 + 6 + 6 + 4 + 4 = 30
            
            for (const catData of categories) {
                const permissionOverwrites = [];
                if (catData.private) {
                    permissionOverwrites.push({
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    });
                }

                const category = await guild.channels.create({
                    name: catData.name,
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: permissionOverwrites
                });

                for (const chan of catData.channels) {
                    await guild.channels.create({
                        name: chan.name,
                        type: chan.type || ChannelType.GuildText,
                        parent: category.id
                    });
                    // Small delay to avoid hitting rate limits
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            message.reply('✅ Server structure with 30 decorative channels created successfully! 🚀');
        } catch (error) {
            console.error(error);
            message.reply(`❌ Failed to create server structure: ${error.message}`);
        }
    }
};
