const axios = require('axios');

/**
 * REZERO-MD Command: shorturl
 * Category: Tools
 * URL shortener using TinyURL API
 */

module.exports = {
    name: 'shorturl',
    category: 'Tools',
    description: 'Shorten a URL',
    usage: '.shorturl <url>',
    ownerOnly: false,

    async execute(client, message, args) {
        if (args.length === 0) {
            return message.reply('❌ Please provide a URL to shorten!\nUsage: .shorturl <url>');
        }

        const url = args[0];

        try {
            const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
            const shortUrl = response.data;

            await message.reply(`
🔗 *URL SHORTENER*

📝 Original: ${url}
✅ Shortened: ${shortUrl}
            `.trim());
        } catch (error) {
            await message.reply('❌ Failed to shorten URL! Please check if the URL is valid.');
        }
    }
};
