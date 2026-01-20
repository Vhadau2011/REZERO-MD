module.exports = {
    name: 'userinfo',
    description: 'Show user information',
    aliases: ['ui', 'whois'],
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(target.id);

        const embed = {
            color: 0x00aaff,
            title: `👤 ${target.tag}`,
            thumbnail: {
                url: target.displayAvatarURL({ size: 512 })
            },
            fields: [
                {
                    name: '🆔 ID',
                    value: target.id,
                    inline: true
                },
                {
                    name: '📅 Account Created',
                    value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`,
                    inline: true
                },
                {
                    name: '📥 Joined Server',
                    value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A',
                    inline: true
                },
                {
                    name: '🎭 Roles',
                    value: member ? `${member.roles.cache.size}` : 'N/A',
                    inline: true
                },
                {
                    name: '🤖 Bot',
                    value: target.bot ? 'Yes' : 'No',
                    inline: true
                }
            ],
            footer: {
                text: `${target.tag}`,
                icon_url: target.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
