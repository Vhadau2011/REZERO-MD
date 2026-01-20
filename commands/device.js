/**
 * REZERO-MD Command: device
 * Category: Utility
 * Displays user device information
 */

module.exports = {
    name: 'device',
    category: 'Utility',
    description: 'Display your device information',
    usage: '.device',
    ownerOnly: false,

    async execute(client, message, args) {
        const contact = await message.getContact();
        const chat = await message.getChat();

        const deviceMsg = `
📱 *DEVICE INFORMATION*

👤 Name: ${contact.pushname || 'Unknown'}
📞 Number: ${contact.number}
💬 Chat Type: ${chat.isGroup ? 'Group' : 'Private'}
📱 Platform: WhatsApp
✅ Status: Connected
        `.trim();

        await message.reply(deviceMsg);
    }
};
