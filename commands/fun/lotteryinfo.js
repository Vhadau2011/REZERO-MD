const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'lotteryinfo',
    description: 'Check lottery information',
    aliases: ['linfo'],
    async execute(message, args, client) {
        const lottery = client.db.data.lottery;
        const userTickets = lottery.tickets.filter(t => t.userId === message.author.id).length;

        const embed = {
            color: 0x00aaff,
            title: '🎫 Lottery Information',
            fields: [
                {
                    name: '💰 Current Pot',
                    value: `$${formatMoney(lottery.pot)}`,
                    inline: true
                },
                {
                    name: '🎫 Total Tickets',
                    value: `${lottery.tickets.length}`,
                    inline: true
                },
                {
                    name: '🎟️ Your Tickets',
                    value: `${userTickets}`,
                    inline: true
                },
                {
                    name: '📊 Win Chance',
                    value: lottery.tickets.length > 0 ? `${((userTickets / lottery.tickets.length) * 100).toFixed(2)}%` : '0%',
                    inline: true
                }
            ],
            footer: {
                text: `Use ${process.env.PREFIX}lottery to buy a ticket`,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
