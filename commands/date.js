const moment = require('moment-timezone');

/**
 * REZERO-MD Command: date
 * Category: Utility
 * Displays current date with details
 */

module.exports = {
    name: 'date',
    category: 'Utility',
    description: 'Display current date',
    usage: '.date',
    ownerOnly: false,

    async execute(client, message, args) {
        const now = moment().tz('Africa/Johannesburg');
        
        const dateMsg = `
📅 *CURRENT DATE*

📆 Full Date: ${now.format('MMMM DD, YYYY')}
📅 Short Date: ${now.format('YYYY-MM-DD')}
📆 Day: ${now.format('dddd')}
📅 Week: ${now.format('w')}
📆 Day of Year: ${now.format('DDD')}
📅 Quarter: Q${now.format('Q')}
        `.trim();

        await message.reply(dateMsg);
    }
};
