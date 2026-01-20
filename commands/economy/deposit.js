const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'deposit',
    description: 'Deposit money to your bank',
    aliases: ['dep'],
    async execute(message, args, client) {
        const user = client.db.getUser(message.author.id);
        let amount;

        if (args[0]?.toLowerCase() === 'all') {
            amount = user.wallet;
        } else {
            amount = parseInt(args[0]);
        }

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.deposit <amount>` or `.deposit all`');
        }

        if (user.wallet < amount) {
            return message.reply(`❌ You don't have enough money in your wallet! You have **$${formatMoney(user.wallet)}**.`);
        }

        await client.db.removeMoney(message.author.id, amount, 'wallet');
        await client.db.addMoney(message.author.id, amount, 'bank');

        const updatedUser = client.db.getUser(message.author.id);

        const embed = {
            color: 0x00ff00,
            title: '🏦 Deposit Successful!',
            description: `You deposited **$${formatMoney(amount)}** to your bank!`,
            fields: [
                {
                    name: '👛 Wallet',
                    value: `$${formatMoney(updatedUser.wallet)}`,
                    inline: true
                },
                {
                    name: '🏦 Bank',
                    value: `$${formatMoney(updatedUser.bank)}`,
                    inline: true
                }
            ],
            footer: {
                text: `${message.author.tag}`,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
