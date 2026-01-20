module.exports = {
    name: 'avatar',
    description: 'Get user avatar',
    aliases: ['av', 'pfp'],
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;

        const embed = {
            color: 0x00aaff,
            title: `${target.username}'s Avatar`,
            image: {
                url: target.displayAvatarURL({ size: 1024, dynamic: true })
            },
            footer: {
                text: `${target.tag}`,
                icon_url: target.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
