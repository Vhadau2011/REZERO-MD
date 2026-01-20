/**
 * REZERO-MD Command: ping
 * Category: General
 * Checks bot response time
 */

module.exports = {
    name: 'ping',
    category: 'General',
    description: 'Check bot response time',
    usage: '.ping',
    ownerOnly: false,

    async execute(client, message, args) {
        const start = Date.now();
        const sent = await message.reply('🏓 Pinging...');
        const end = Date.now();
        
        const responseTime = end - start;
        
        await sent.edit(`🏓 *Pong!*\n\n⏱️ Response Time: ${responseTime}ms`);
    }
};
