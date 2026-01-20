const { config } = require('../utils/config');
const os = require('os');

/**
 * REZERO-MD Command: botinfo
 * Category: General
 * Displays bot information
 */

module.exports = {
    name: 'botinfo',
    category: 'General',
    description: 'Display bot information',
    usage: '.botinfo',
    ownerOnly: false,

    async execute(client, message, args) {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const usedMemory = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);

        const botInfo = `
╔═══════════════════════════
║ 🤖 *BOT INFORMATION*
╠═══════════════════════════
║ 📱 Name: ${config.bot.name}
║ 📦 Version: 1.0.0
║ 👑 Owner: ${config.owner.name}
║ 🔧 Prefix: ${config.bot.prefix}
║ ⏰ Uptime: ${hours}h ${minutes}m
║ 💾 Memory: ${usedMemory}GB / ${totalMemory}GB
║ 🖥️ Platform: ${os.platform()}
║ 📡 Node.js: ${process.version}
╚═══════════════════════════

_REZERO-MD - Built with ❤️_
        `.trim();

        await message.reply(botInfo);
    }
};
