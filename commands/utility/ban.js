const { isGuard } = require('../../utils/permissions');

module.exports = {
    name: 'ban',
    description: 'Ban a user (Guards only)',
    async execute(message, args, client) {
        if (!isGuard(message.author.id)) {
            return message.reply('❌ You do not have permission to use this command!');
        }

        const target = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!target) {
            return message.reply('❌ Please mention a user to ban!');
        }

        if (!target.bannable) {
            return message.reply('❌ I cannot ban this user!');
        }

        try {
            await target.ban({ reason: reason });
            
            const embed = {
                color: 0xff0000,
                title: '🔨 User Banned',
                fields: [
                    {
                        name: '👤 User',
                        value: `${target.user.tag}`,
                        inline: true
                    },
                    {
                        name: '👮 Banned By',
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
            console.error('Error banning user:', error);
            message.reply('❌ Failed to ban user.');
        }
    }
};
