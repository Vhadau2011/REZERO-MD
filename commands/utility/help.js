module.exports = {
    name: 'help',
    description: 'Show all commands',
    aliases: ['commands', 'cmds'],
    async execute(message, args, client) {
        const prefix = process.env.PREFIX;

        const embed = {
            color: 0x00aaff,
            title: '🤖 REZERO-MD BOT COMMANDS',
            description: `Use \`${prefix}help <category>\` for more details on a category.`,
            fields: [
                {
                    name: '🎰 Gambling (Channel-Locked)',
                    value: `\`${prefix}slot\`, \`${prefix}bet\`, \`${prefix}gamble\`, \`${prefix}rolate\`, \`${prefix}coinflip\``,
                    inline: false
                },
                {
                    name: '💰 Economy',
                    value: `\`${prefix}balance\`, \`${prefix}daily\`, \`${prefix}weekly\`, \`${prefix}work\`, \`${prefix}crime\`, \`${prefix}deposit\`, \`${prefix}withdraw\`, \`${prefix}give\`, \`${prefix}leaderboard\`, \`${prefix}profile\`, \`${prefix}inventory\``,
                    inline: false
                },
                {
                    name: '🏪 Shop',
                    value: `\`${prefix}shop\`, \`${prefix}buy\`, \`${prefix}additem\`, \`${prefix}removeitem\``,
                    inline: false
                },
                {
                    name: '🎮 Fun & Games',
                    value: `\`${prefix}dice\`, \`${prefix}rps\`, \`${prefix}blackjack\`, \`${prefix}highlow\`, \`${prefix}guess\`, \`${prefix}wheel\`, \`${prefix}scratch\`, \`${prefix}race\``,
                    inline: false
                },
                {
                    name: '🎫 Ticket System',
                    value: `\`${prefix}topen\`, \`${prefix}tclose\``,
                    inline: false
                },
                {
                    name: '🛠️ Utility',
                    value: `\`${prefix}help\`, \`${prefix}ping\`, \`${prefix}stats\`, \`${prefix}serverinfo\`, \`${prefix}userinfo\`, \`${prefix}avatar\``,
                    inline: false
                },
                {
                    name: '👮 Moderation (Guards Only)',
                    value: `\`${prefix}clear\`, \`${prefix}kick\`, \`${prefix}ban\`, \`${prefix}unban\`, \`${prefix}mute\`, \`${prefix}unmute\``,
                    inline: false
                }
            ],
            footer: {
                text: `REZERO-MD | Total Commands: ${client.commands.size}`,
                icon_url: client.user.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
