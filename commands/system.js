const os = require('os');

/**
 * REZERO-MD Command: system
 * Category: Utility
 * Displays bot system information
 */

module.exports = {
    name: 'system',
    category: 'Utility',
    description: 'Display system information',
    usage: '.system',
    ownerOnly: false,

    async execute(client, message, args) {
        const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeMemory = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedMemory = (totalMemory - freeMemory).toFixed(2);
        const cpus = os.cpus();

        const systemMsg = `
🖥️ *SYSTEM INFORMATION*

💾 Total Memory: ${totalMemory} GB
💾 Used Memory: ${usedMemory} GB
💾 Free Memory: ${freeMemory} GB

🔧 CPU Model: ${cpus[0].model}
🔧 CPU Cores: ${cpus.length}
🔧 CPU Speed: ${cpus[0].speed} MHz

🖥️ Platform: ${os.platform()}
🖥️ Architecture: ${os.arch()}
📡 Node.js: ${process.version}
        `.trim();

        await message.reply(systemMsg);
    }
};
