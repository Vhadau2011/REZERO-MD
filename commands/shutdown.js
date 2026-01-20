/**
 * REZERO-MD Command: shutdown
 * Category: Owner
 * Shuts down the bot (owner only)
 */

module.exports = {
    name: 'shutdown',
    category: 'Owner',
    description: 'Shutdown the bot',
    usage: '.shutdown',
    ownerOnly: true,

    async execute(client, message, args) {
        await message.reply('👋 Shutting down REZERO-MD... Goodbye!');
        
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    }
};
