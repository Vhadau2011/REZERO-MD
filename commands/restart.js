/**
 * REZERO-MD Command: restart
 * Category: Owner
 * Restarts the bot (owner only)
 */

module.exports = {
    name: 'restart',
    category: 'Owner',
    description: 'Restart the bot',
    usage: '.restart',
    ownerOnly: true,

    async execute(client, message, args) {
        await message.reply('🔄 Restarting REZERO-MD...');
        
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    }
};
