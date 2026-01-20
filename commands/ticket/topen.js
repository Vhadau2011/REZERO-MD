const { PermissionFlagsBits, ChannelType } = require('discord.js');
const { isOwner, isGuard } = require('../../utils/permissions');

module.exports = {
    name: 'topen',
    description: 'Open a support ticket',
    aliases: ['ticketopen', 'openticket'],
    async execute(message, args, client) {
        // Check if user already has an open ticket
        const existingTicket = Object.entries(client.db.data.tickets).find(
            ([channelId, data]) => data.userId === message.author.id
        );

        if (existingTicket) {
            const channel = message.guild.channels.cache.get(existingTicket[0]);
            if (channel) {
                return message.reply(`❌ You already have an open ticket: ${channel}`);
            }
        }

        const reason = args.join(' ') || 'No reason provided';

        try {
            // Create ticket channel
            const ticketChannel = await message.guild.channels.create({
                name: `ticket-${message.author.username}`,
                type: ChannelType.GuildText,
                topic: `Ticket opened by ${message.author.tag} | Reason: ${reason}`,
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: message.author.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.EmbedLinks
                        ]
                    }
                ]
            });

            // Add owner permission
            if (process.env.OWNER_ID) {
                await ticketChannel.permissionOverwrites.create(process.env.OWNER_ID, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                    ManageMessages: true,
                    ManageChannels: true
                });
            }

            // Add guards permissions
            if (process.env.GUARDS_ID) {
                const guards = process.env.GUARDS_ID.split(',');
                for (const guardId of guards) {
                    await ticketChannel.permissionOverwrites.create(guardId.trim(), {
                        ViewChannel: true,
                        SendMessages: true,
                        ReadMessageHistory: true,
                        ManageMessages: true
                    });
                }
            }

            // Save ticket to database
            await client.db.createTicket(ticketChannel.id, message.author.id);

            // Send welcome message in ticket
            const embed = {
                color: 0x00ff00,
                title: '🎫 Support Ticket',
                description: `Welcome ${message.author}!\n\nThank you for opening a ticket. Our support team will be with you shortly.`,
                fields: [
                    {
                        name: '📝 Reason',
                        value: reason,
                        inline: false
                    },
                    {
                        name: '❓ How to close',
                        value: `Use \`${process.env.PREFIX}tclose\` to close this ticket.`,
                        inline: false
                    }
                ],
                footer: {
                    text: `Ticket opened by ${message.author.tag}`,
                    icon_url: message.author.displayAvatarURL()
                },
                timestamp: new Date()
            };

            await ticketChannel.send({ embeds: [embed] });

            // Confirm in original channel
            message.reply(`✅ Ticket created! ${ticketChannel}`);

        } catch (error) {
            console.error('Error creating ticket:', error);
            message.reply('❌ Failed to create ticket. Please contact an administrator.');
        }
    }
};
