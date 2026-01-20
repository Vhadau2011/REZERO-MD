const { config } = require('../utils/config');

/**
 * REZERO-MD Command: alive
 * Category: General
 * Checks if bot is running
 */

module.exports = {
    name: 'alive',
    category: 'General',
    description: 'Check if bot is alive',
    usage: '.alive',
    ownerOnly: false,

    async execute(client, message, args) {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const aliveMsg = `
🤖 *${config.bot.name} is Alive!*

✅ Status: Online
⏰ Uptime: ${hours}h ${minutes}m ${seconds}s
👑 Owner: ${config.owner.name}
📦 Version: 1.0.0

_REZERO-MD - Always Ready!_
        `.trim();

        await message.reply(aliveMsg);
    }
};
