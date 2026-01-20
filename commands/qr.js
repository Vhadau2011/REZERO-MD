const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');

/**
 * REZERO-MD Command: qr
 * Category: Tools
 * Generate QR code from text
 */

module.exports = {
    name: 'qr',
    category: 'Tools',
    description: 'Generate QR code from text',
    usage: '.qr <text>',
    ownerOnly: false,

    async execute(client, message, args) {
        if (args.length === 0) {
            return message.reply('❌ Please provide text to generate QR code!\nUsage: .qr <text>');
        }

        const text = args.join(' ');

        try {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;
            
            const response = await axios.get(qrUrl, { responseType: 'arraybuffer' });
            const base64 = Buffer.from(response.data, 'binary').toString('base64');
            const media = new MessageMedia('image/png', base64, 'qrcode.png');

            await message.reply(media, undefined, { caption: `📱 *QR CODE*\n\n📝 Text: ${text}` });
        } catch (error) {
            await message.reply('❌ Failed to generate QR code!');
        }
    }
};
