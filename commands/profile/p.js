const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'p',
    category: 'profile',
    description: 'View a Royal Card',
    aliases: ['profile'],
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;
        const userData = await client.db.getUser(target.id, target.username);

        if (!userData.info.registered) {
            if (target.id === message.author.id) {
                return message.reply('⚠️ Sorry, you don\'t have a Royal Card. Please register first using `.reg <age>`.');
            } else {
                return message.reply(`⚠️ ${target.username} does not have a Royal Card yet.`);
            }
        }

        const info = userData.info;
        const economy = userData.economy;

        // Content using the original font style (fixed-width/mono)
        const content = [
            `👑 **USER PROFILE**`,
            `• NAME: ${info.name}`,
            `• AGE: ${info.age}`,
            `• ROLE: ${info.role}`,
            `.`,
            `💳 WALLET: $${formatMoney(economy.wallet)}`,
            `🏦 BANK: $${formatMoney(economy.bank)}`,
            `📜 BIO: ${info.bio}`,
            `✅ STATUS: ${info.banned ? '🚫 BANNED' : '✅ ACTIVE'}`,
            `────────────`
        ].join('\n');

        const embed = {
            color: 0x0099ff, // Blue color for the side line
            description: content,
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
