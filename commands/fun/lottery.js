const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'lottery',
    category: 'fun',
    description: 'Buy a lottery ticket',
    async execute(message, args, client) {
        const ticketPrice = 500;
        const user = client.db.getUser(message.author.id);

        if (user.economy.wallet < ticketPrice) {
            return message.reply(`❌ You need **$${formatMoney(ticketPrice)}** to buy a lottery ticket!`);
        }

        await client.db.removeMoney(message.author.id, ticketPrice);
        
        client.db.data.lottery.pot += ticketPrice;
        client.db.data.lottery.tickets.push({
            userId: message.author.id,
            purchasedAt: Date.now()
        });
        await client.db.save();

        const embed = {
            color: 0x00ff00,
            title: '🎫 Lottery Ticket Purchased!',
            description: `You bought a lottery ticket for **$${formatMoney(ticketPrice)}**!`,
            fields: [
                {
                    name: '💰 Current Pot',
                    value: `$${formatMoney(client.db.data.lottery.pot)}`,
                    inline: true
                },
                {
                    name: '🎫 Total Tickets',
                    value: `${client.db.data.lottery.tickets.length}`,
                    inline: true
                }
            ],
            footer: {
                text: `Use ${process.env.PREFIX}lotteryinfo to check details`,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
