const { isGuard } = require('../../utils/permissions');

module.exports = {
    name: 'kick',
    description: 'Kick a user (Guards only)',
    async execute(message, args, client) {
        if (!isGuard(message.author.id)) {
            return message.reply('❌ You do not have permission to use this command!');
        }

        const target = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!target) {
            return message.reply('❌ Please mention a user to kick!');
        }

        if (!target.kickable) {
            return message.reply('❌ I cannot kick this user!');
        }

        try {
            await target.kick(reason);
            
            const embed = {
                color: 0xff0000,
                title: '👢 User Kicked',
                fields: [
                    {
                        name: '👤 User',
                        value: `${target.user.tag}`,
                        inline: true
                    },
                    {
                        name: '👮 Kicked By',
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
            console.error('Error kicking user:', error);
            message.reply('❌ Failed to kick user.');
        }
    }
};
