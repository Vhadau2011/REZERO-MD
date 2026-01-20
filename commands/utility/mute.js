const { isGuard } = require('../../utils/permissions');

module.exports = {
    name: 'mute',
    description: 'Timeout a user (Guards only)',
    async execute(message, args, client) {
        if (!isGuard(message.author.id)) {
            return message.reply('❌ You do not have permission to use this command!');
        }

        const target = message.mentions.members.first();
        const duration = parseInt(args[1]) || 10; // minutes
        const reason = args.slice(2).join(' ') || 'No reason provided';

        if (!target) {
            return message.reply('❌ Please mention a user to mute!');
        }

        if (!target.moderatable) {
            return message.reply('❌ I cannot mute this user!');
        }

        try {
            await target.timeout(duration * 60 * 1000, reason);
            
            const embed = {
                color: 0xffaa00,
                title: '🔇 User Muted',
                fields: [
                    {
                        name: '👤 User',
                        value: `${target.user.tag}`,
                        inline: true
                    },
                    {
                        name: '⏰ Duration',
                        value: `${duration} minutes`,
                        inline: true
                    },
                    {
                        name: '👮 Muted By',
                        value: `${message.author.tag}`,
                        inline: true
                    },
                    {
                        name: '📝 Reason',
                        value: reason,
                        inline: false
                    }
                ],
                timestamp: new Date()
            };

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error muting user:', error);
            message.reply('❌ Failed to mute user.');
        }
    }
};
