const { config } = require('../utils/config');

/**
 * REZERO-MD Command: owner
 * Category: General
 * Displays owner information
 */

module.exports = {
    name: 'owner',
    category: 'General',
    description: 'Display owner information',
    usage: '.owner',
    ownerOnly: false,

    async execute(client, message, args) {
        const ownerInfo = `
👑 *BOT OWNER INFORMATION*

📱 Name: ${config.owner.name}
💻 GitHub: @${config.owner.github}
🔗 Profile: https://github.com/${config.owner.github}

_Contact the owner for support or inquiries_
        `.trim();

        await message.reply(ownerInfo);
    }
};
