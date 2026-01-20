const { isGuard } = require('../../utils/permissions');

module.exports = {
    name: 'unban',
    description: 'Unban a user (Guards only)',
    async execute(message, args, client) {
        if (!isGuard(message.author.id)) {
            return message.reply('❌ You do not have permission to use this command!');
        }

        const userId = args[0];

        if (!userId) {
            return message.reply('❌ Please provide a user ID to unban!');
        }

        try {
            await message.guild.members.unban(userId);
            message.reply(`✅ Successfully unbanned user with ID: ${userId}`);
        } catch (error) {
            console.error('Error unbanning user:', error);
            message.reply('❌ Failed to unban user. Make sure the ID is correct and the user is banned.');
        }
    }
};
