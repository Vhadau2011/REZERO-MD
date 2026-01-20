const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ChannelType, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // Handle Button Interactions
        if (interaction.isButton()) {
            const { customId, guild, user, channel, member } = interaction;

            // 1. Open Ticket Button
            if (customId === 'open_ticket') {
                // Check if user already has an open ticket
                const existingTicket = Object.values(client.db.data.tickets || {}).find(t => t.ownerId === user.id && t.status === 'open');
                if (existingTicket) {
                    const ticketChannel = guild.channels.cache.get(existingTicket.channelId);
                    if (ticketChannel) {
                        return interaction.reply({ content: `❌ You already have an open ticket: ${ticketChannel}`, ephemeral: true });
                    } else {
                        // Cleanup dead ticket data
                        delete client.db.data.tickets[existingTicket.channelId];
                        await client.db.save();
                    }
                }

                const embed = new EmbedBuilder()
                    .setColor(0x2f3136)
                    .setTitle('Select Ticket Category')
                    .setDescription('Please select the category that best describes your issue.');

                const row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('select_category')
                            .setPlaceholder('Choose a category...')
                            .addOptions([
                                { label: 'Support', value: 'support', emoji: '🛠️', description: 'General help and support' },
                                { label: 'Report', value: 'report', emoji: '🚩', description: 'Report a user or incident' },
                                { label: 'Buy', value: 'buy', emoji: '💰', description: 'Inquiries about purchases' },
                                { label: 'Appeal', value: 'appeal', emoji: '⚖️', description: 'Appeal a ban or warning' },
                                { label: 'Other', value: 'other', emoji: '❓', description: 'Anything else' },
                            ])
                    );

                return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            }

            // 2. Staff Controls
            const ticket = client.db.data.tickets ? client.db.data.tickets[channel.id] : null;
            const staffRoleId = process.env.STAFF_ROLE_ID;
            const isStaff = member.roles.cache.has(staffRoleId) || user.id === process.env.OWNER_ID;

            if (['claim_ticket', 'lock_ticket', 'close_ticket'].includes(customId)) {
                if (!isStaff) return interaction.reply({ content: '❌ Only staff members can use these controls!', ephemeral: true });
                if (!ticket) return interaction.reply({ content: '❌ This channel is not registered as a ticket.', ephemeral: true });

                // Claim Ticket
                if (customId === 'claim_ticket') {
                    if (ticket.claimedBy) return interaction.reply({ content: `❌ This ticket is already claimed by <@${ticket.claimedBy}>`, ephemeral: true });
                    
                    ticket.claimedBy = user.id;
                    await client.db.save();

                    const claimedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
                        .addFields({ name: '🧑‍💼 Claimed By', value: `<@${user.id}>`, inline: true });
                    
                    await interaction.message.edit({ embeds: [claimedEmbed] });
                    return interaction.reply({ content: `✅ You have claimed this ticket.` });
                }

                // Lock Ticket
                if (customId === 'lock_ticket') {
                    await channel.permissionOverwrites.edit(ticket.ownerId, {
                        SendMessages: false
                    });
                    return interaction.reply({ content: '🔒 Ticket has been locked. The user can no longer send messages.' });
                }

                // Close Ticket
                if (customId === 'close_ticket') {
                    await interaction.reply({ content: '🧹 Closing ticket and generating transcript...' });
                    
                    // Generate Transcript
                    const messages = await channel.messages.fetch({ limit: 100 });
                    let transcriptText = `REZERO-MD TICKET TRANSCRIPT\n`;
                    transcriptText += `Ticket ID: ${channel.id}\n`;
                    transcriptText += `Owner: ${ticket.ownerId}\n`;
                    transcriptText += `Category: ${ticket.category}\n`;
                    transcriptText += `Closed By: ${user.tag}\n`;
                    transcriptText += `Date: ${new Date().toLocaleString()}\n`;
                    transcriptText += `------------------------------------------\n\n`;

                    messages.reverse().forEach(m => {
                        transcriptText += `[${m.createdAt.toLocaleString()}] ${m.author.tag}: ${m.content}\n`;
                    });

                    const attachment = new AttachmentBuilder(Buffer.from(transcriptText), { name: `transcript-${channel.name}.txt` });

                    // Log to channel
                    const logChannel = guild.channels.cache.get(process.env.TICKET_LOG_CHANNEL_ID);
                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle('📄 Ticket Closed')
                            .addFields(
                                { name: 'Owner', value: `<@${ticket.ownerId}>`, inline: true },
                                { name: 'Category', value: ticket.category, inline: true },
                                { name: 'Closed By', value: `<@${user.id}>`, inline: true }
                            )
                            .setTimestamp();
                        
                        await logChannel.send({ embeds: [logEmbed], files: [attachment] });
                    }

                    setTimeout(async () => {
                        delete client.db.data.tickets[channel.id];
                        await client.db.save();
                        await channel.delete().catch(() => {});
                    }, 5000);
                }
            }
        }

        // Handle Select Menu Interactions
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'select_category' || interaction.customId === 'select_category_direct') {
                const category = interaction.values[0];
                const { guild, user } = interaction;

                // Create Ticket Channel
                const channel = await guild.channels.create({
                    name: `ticket-${category}-${user.username}`,
                    type: ChannelType.GuildText,
                    parent: process.env.TICKET_CATEGORY_ID || null,
                    permissionOverwrites: [
                        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                        { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                        { id: process.env.STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                        { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
                    ]
                });

                // Save to DB
                if (!client.db.data.tickets) client.db.data.tickets = {};
                client.db.data.tickets[channel.id] = {
                    channelId: channel.id,
                    ownerId: user.id,
                    category: category,
                    status: 'open',
                    createdAt: Date.now()
                };
                await client.db.save();

                const welcomeEmbed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle(`Ticket: ${category.toUpperCase()}`)
                    .setDescription(`Hello <@${user.id}>, welcome to your ticket!\nStaff will be with you shortly. Please explain your issue in detail.`)
                    .addFields(
                        { name: '👤 Owner', value: `<@${user.id}>`, inline: true },
                        { name: '📂 Category', value: category, inline: true }
                    )
                    .setFooter({ text: 'REZERO-MD Staff Controls' });

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('claim_ticket').setLabel('Claim').setEmoji('🧑‍💼').setStyle(ButtonStyle.Success),
                        new ButtonBuilder().setCustomId('lock_ticket').setLabel('Lock').setEmoji('🔒').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('close_ticket').setLabel('Close').setEmoji('🧹').setStyle(ButtonStyle.Danger)
                    );

                await channel.send({ content: `<@&${process.env.STAFF_ROLE_ID}> a new ticket has been opened!`, embeds: [welcomeEmbed], components: [row] });
                
                // If it was from the ephemeral category selector, update it
                if (interaction.customId === 'select_category') {
                    return interaction.update({ content: `✅ Ticket created: ${channel}`, embeds: [], components: [], ephemeral: true });
                } else {
                    // If it was from the direct menu on the panel, reply ephemerally
                    return interaction.reply({ content: `✅ Ticket created: ${channel}`, ephemeral: true });
                }
            }
        }
    }
};
