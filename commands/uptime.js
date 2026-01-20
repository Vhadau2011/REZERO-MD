/**
 * REZERO-MD Command: uptime
 * Category: Utility
 * Displays bot uptime
 */

module.exports = {
    name: 'uptime',
    category: 'Utility',
    description: 'Display bot uptime',
    usage: '.uptime',
    ownerOnly: false,

    async execute(client, message, args) {
        const uptime = process.uptime();
        
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const uptimeMsg = `
⏰ *BOT UPTIME*

📊 Total Uptime: ${uptime.toFixed(0)} seconds

📅 Days: ${days}
⏰ Hours: ${hours}
⏱️ Minutes: ${minutes}
⏲️ Seconds: ${seconds}

✅ Bot has been running smoothly!
        `.trim();

        await message.reply(uptimeMsg);
    }
};
