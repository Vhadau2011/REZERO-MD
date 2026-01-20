const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'leaderboard',
    description: 'View the richest users',
    aliases: ['lb', 'top', 'rich'],
    async execute(message, args, client) {
        const leaderboard = client.db.getLeaderboard('wallet', 10);

        if (leaderboard.length === 0) {
            return message.reply('❌ No users found in the leaderboard!');
        }

        const fields = await Promise.all(leaderboard.map(async ([userId, userData], index) => {
            try {
                const user = await client.users.fetch(userId);
                const total = userData.wallet + userData.bank;
                return {
                    name: `${index + 1}. ${user.tag}`,
                    value: `💰 Wallet: $${formatMoney(userData.wallet)}\n🏦 Bank: $${formatMoney(userData.bank)}\n💵 Total: $${formatMoney(total)}`,
                    inline: false
                };
            } catch (error) {
                return {
                    name: `${index + 1}. Unknown User`,
                    value: `💰 Wallet: $${formatMoney(userData.wallet)}\n🏦 Bank: $${formatMoney(userData.bank)}`,
                    inline: false
                };
            }
        }));

        const embed = {
            color: 0xffd700,
            title: '🏆 LEADERBOARD - TOP 10 RICHEST USERS',
            fields: fields,
            footer: {
                text: `Requested by ${message.author.tag}`,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
