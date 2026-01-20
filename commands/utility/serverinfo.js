module.exports = {
    name: 'serverinfo',
    description: 'Show server information',
    aliases: ['si', 'server'],
    async execute(message, args, client) {
        const guild = message.guild;

        const embed = {
            color: 0x00aaff,
            title: `📊 ${guild.name}`,
            thumbnail: {
                url: guild.iconURL()
            },
            fields: [
                {
                    name: '👑 Owner',
                    value: `<@${guild.ownerId}>`,
                    inline: true
                },
                {
                    name: '📅 Created',
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
                    inline: true
                },
                {
                    name: '👥 Members',
                    value: `${guild.memberCount}`,
                    inline: true
                },
                {
                    name: '💬 Channels',
                    value: `${guild.channels.cache.size}`,
                    inline: true
                },
                {
                    name: '😀 Emojis',
                    value: `${guild.emojis.cache.size}`,
                    inline: true
                },
                {
                    name: '🎭 Roles',
                    value: `${guild.roles.cache.size}`,
                    inline: true
                }
            ],
            footer: {
                text: `Server ID: ${guild.id}`,
                icon_url: guild.iconURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
