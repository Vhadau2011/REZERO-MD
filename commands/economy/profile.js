const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'profile',
    description: 'View your profile',
    aliases: ['prof', 'stats'],
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;
        const user = client.db.getUser(target.id);

        const total = user.wallet + user.bank;
        const winRate = user.wins + user.losses > 0 
            ? ((user.wins / (user.wins + user.losses)) * 100).toFixed(2) 
            : 0;

        const embed = {
            color: 0x00aaff,
            title: `📊 ${target.username}'s Profile`,
            thumbnail: {
                url: target.displayAvatarURL()
            },
            fields: [
                {
                    name: '💰 Economy',
                    value: `👛 Wallet: $${formatMoney(user.wallet)}\n🏦 Bank: $${formatMoney(user.bank)}\n💵 Total: $${formatMoney(total)}`,
                    inline: true
                },
                {
                    name: '🎰 Gambling Stats',
                    value: `✅ Wins: ${user.wins}\n❌ Losses: ${user.losses}\n📊 Win Rate: ${winRate}%\n💸 Total Gambled: $${formatMoney(user.totalGambled)}`,
                    inline: true
                },
                {
                    name: '📦 Inventory',
                    value: `${user.inventory.length} items`,
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
