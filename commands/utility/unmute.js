const { isGuard } = require('../../utils/permissions');

module.exports = {
    name: 'unmute',
    description: 'Remove timeout from a user (Guards only)',
    async execute(message, args, client) {
        if (!isGuard(message.author.id)) {
            return message.reply('❌ You do not have permission to use this command!');
        }

        const target = message.mentions.members.first();

        if (!target) {
            return message.reply('❌ Please mention a user to unmute!');
        }

        if (!target.moderatable) {
            return message.reply('❌ I cannot unmute this user!');
        }

        try {
            await target.timeout(null);
            
            const embed = {
                color: 0x00ff00,
                title: '🔊 User Unmuted',
                fields: [
                    {
                        name: '👤 User',
                        value: `${target.user.tag}`,
                        inline: true
                    },
                    {
                        name: '👮 Unmuted By',
                        value: `${message.author.tag}`,
                        inline: true
                    }
                ],
                timestamp: new Date()
            };

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error unmuting user:', error);
            message.reply('❌ Failed to unmute user.');
        }
    }
};
