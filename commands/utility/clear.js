const { isGuard } = require('../../utils/permissions');

module.exports = {
    name: 'clear',
    description: 'Clear messages (Guards only)',
    aliases: ['purge', 'delete'],
    async execute(message, args, client) {
        if (!isGuard(message.author.id)) {
            return message.reply('❌ You do not have permission to use this command!');
        }

        const amount = parseInt(args[0]);

        if (!amount || amount < 1 || amount > 100) {
            return message.reply('❌ Please specify a number between 1 and 100!');
        }

        try {
            const deleted = await message.channel.bulkDelete(amount + 1, true);
            
            const reply = await message.channel.send(`✅ Successfully deleted **${deleted.size - 1}** messages!`);
            
            setTimeout(() => reply.delete().catch(() => {}), 5000);
        } catch (error) {
            console.error('Error clearing messages:', error);
            message.reply('❌ Failed to clear messages. Make sure the messages are not older than 14 days.');
        }
    }
};
