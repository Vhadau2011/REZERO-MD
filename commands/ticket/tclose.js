const { isOwner, isGuard } = require('../../utils/permissions');

module.exports = {
    name: 'tclose',
    description: 'Close a support ticket',
    aliases: ['ticketclose', 'closeticket'],
    async execute(message, args, client) {
        const ticket = client.db.getTicket(message.channel.id);

        if (!ticket) {
            return message.reply('❌ This is not a ticket channel!');
        }

        // Check if user is the ticket owner, a guard, or the owner
        const isTicketOwner = ticket.userId === message.author.id;
        const canClose = isTicketOwner || isGuard(message.author.id);

        if (!canClose) {
            return message.reply('❌ You do not have permission to close this ticket!');
        }

        const reason = args.join(' ') || 'No reason provided';

        try {
            // Send closing message
            const embed = {
                color: 0xff0000,
                title: '🔒 Ticket Closing',
                description: `This ticket is being closed by ${message.author}.`,
                fields: [
                    {
                        name: '📝 Reason',
                        value: reason,
                        inline: false
                    },
                    {
                        name: '⏰ Closing in',
                        value: '5 seconds...',
                        inline: false
                    }
                ],
                footer: {
                    text: `Closed by ${message.author.tag}`,
                    icon_url: message.author.displayAvatarURL()
                },
                timestamp: new Date()
            };

            await message.channel.send({ embeds: [embed] });

            // Delete ticket from database
            await client.db.deleteTicket(message.channel.id);

            // Delete channel after 5 seconds
            setTimeout(async () => {
                try {
                    await message.channel.delete();
                } catch (error) {
                    console.error('Error deleting ticket channel:', error);
                }
            }, 5000);

        } catch (error) {
            console.error('Error closing ticket:', error);
            message.reply('❌ Failed to close ticket. Please try again.');
        }
    }
};
