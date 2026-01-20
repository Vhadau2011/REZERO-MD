const moment = require('moment-timezone');

/**
 * REZERO-MD Command: time
 * Category: Utility
 * Displays current time in different timezones
 */

module.exports = {
    name: 'time',
    category: 'Utility',
    description: 'Display current time',
    usage: '.time [timezone]',
    ownerOnly: false,

    async execute(client, message, args) {
        const timezone = args[0] || 'Africa/Johannesburg';

        try {
            const time = moment().tz(timezone).format('HH:mm:ss');
            const date = moment().tz(timezone).format('YYYY-MM-DD');
            const day = moment().tz(timezone).format('dddd');

            const timeMsg = `
⏰ *CURRENT TIME*

🕐 Time: ${time}
📅 Date: ${date}
📆 Day: ${day}
🌍 Timezone: ${timezone}
            `.trim();

            await message.reply(timeMsg);
        } catch (error) {
            await message.reply('❌ Invalid timezone! Example: .time America/New_York');
        }
    }
};
