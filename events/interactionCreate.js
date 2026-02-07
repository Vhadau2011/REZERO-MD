const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ChannelType, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try {
            // Handle Button Interactions
            if (interaction.isButton()) {
                const { customId, guild, user, channel, member } = interaction;

                // 1. Open Ticket Button
                if (customId === 'open_ticket') {
                    await interaction.deferReply({ ephemeral: true });

                    const existingTicket = Object.values(client.db.data.tickets || {}).find(t => t.ownerId === user.id && t.status === 'open');
                    if (existingTicket) {
                        const ticketChannel = guild.channels.cache.get(existingTicket.channelId);
                        if (ticketChannel) {
                            return interaction.editReply({ content: `❌ You already have an open ticket: ${ticketChannel}` });
                        } else {
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
                                    { label: 'Partnership', value: 'partnership', emoji: '🤝', description: 'Partnership inquiries' },
                                    { label: 'Other', value: 'other', emoji: '❓', description: 'Anything else' },
                                ])
                        );

                    return interaction.editReply({ embeds: [embed], components: [row] });
                }

                // 2. Staff Controls
                const ticket = client.db.data.tickets ? client.db.data.tickets[channel.id] : null;
                const staffRoleId = process.env.STAFF_ROLE_ID;
                const isStaff = member.roles.cache.has(staffRoleId) || user.id === process.env.OWNER_ID;

                if (['claim_ticket', 'lock_ticket', 'close_ticket', 'save_ticket'].includes(customId)) {
                    if (!isStaff) return interaction.reply({ content: '❌ Only staff members can use these controls!', ephemeral: true });
                    if (!ticket) return interaction.reply({ content: '❌ This channel is not registered as a ticket.', ephemeral: true });

                    if (customId === 'claim_ticket') {
                        if (ticket.claimedBy) return interaction.reply({ content: `❌ This ticket is already claimed by <@${ticket.claimedBy}>`, ephemeral: true });
                        ticket.claimedBy = user.id;
                        await client.db.save();
                        const claimedEmbed = EmbedBuilder.from(interaction.message.embeds[0]).addFields({ name: '🧑‍💼 Claimed By', value: `<@${user.id}>`, inline: true });
                        await interaction.message.edit({ embeds: [claimedEmbed] });
                        return interaction.reply({ content: `✅ You have claimed this ticket.` });
                    }

                    if (customId === 'lock_ticket') {
                        await channel.permissionOverwrites.edit(ticket.ownerId, { SendMessages: false });
                        return interaction.reply({ content: '🔒 Ticket has been locked. Only staff members can now send messages.' });
                    }

                    if (customId === 'save_ticket' || customId === 'close_ticket') {
                        await interaction.reply({ content: customId === 'close_ticket' ? '🧹 Closing ticket and saving data...' : '💾 Saving ticket data to logs...' });
                        
                        const messages = await channel.messages.fetch({ limit: 100 });
                        let transcriptText = `REZERO-MD TICKET TRANSCRIPT\nTicket ID: ${channel.id}\nOwner ID: ${ticket.ownerId}\nCategory: ${ticket.category}\nSaved By: ${user.tag}\nDate: ${new Date().toLocaleString()}\n------------------------------------------\n\n`;
                        messages.reverse().forEach(m => { transcriptText += `[${m.createdAt.toLocaleString()}] ${m.author.tag}: ${m.content}\n`; });
                        const attachment = new AttachmentBuilder(Buffer.from(transcriptText), { name: `transcript-${channel.name}.txt` });

                        const logChannel = guild.channels.cache.get(process.env.TICKET_LOG_CHANNEL_ID);
                        if (logChannel) {
                            const logEmbed = new EmbedBuilder()
                                .setColor(customId === 'close_ticket' ? 0xff0000 : 0x00ff00)
                                .setTitle(customId === 'close_ticket' ? '📄 Ticket Closed' : '💾 Ticket Saved')
                                .addFields({ name: 'Owner', value: `<@${ticket.ownerId}>`, inline: true }, { name: 'Category', value: ticket.category, inline: true }, { name: 'Action By', value: `<@${user.id}>`, inline: true })
                                .setTimestamp();
                            await logChannel.send({ embeds: [logEmbed], files: [attachment] });
                        }

                        if (customId === 'close_ticket') {
                            setTimeout(async () => {
                                delete client.db.data.tickets[channel.id];
                                await client.db.save();
                                await channel.delete().catch(() => {});
                            }, 5000);
                        }
                    }
                }
            }

            // Handle Select Menu Interactions
            if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'select_category' || interaction.customId === 'select_category_direct') {
                    await interaction.deferReply({ ephemeral: true });
                    
                    const category = interaction.values[0];
                    const { guild, user } = interaction;

                    let channel;
                    try {
                        // 1. Create Ticket Channel
                        channel = await guild.channels.create({
                            name: `ticket-${category}-${user.username}`,
                            type: ChannelType.GuildText,
                            parent: process.env.TICKET_CATEGORY_ID || null,
                            permissionOverwrites: [
                                { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                                { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                                { id: process.env.STAFF_ROLE_ID || guild.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                                { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
                            ]
                        });
                        console.log(`[Ticket] Channel created: ${channel.id}`);
                    } catch (err) {
                        console.error('[Ticket] Error creating channel:', err);
                        return await interaction.editReply({ content: '❌ Failed to create ticket channel. Please check bot permissions (Manage Channels).' });
                    }

                    try {
                        // 2. Send Welcome Message FIRST (so user sees it immediately)
                        const welcomeEmbed = new EmbedBuilder()
                            .setColor(0x00ff00)
                            .setTitle(`Ticket: ${category.toUpperCase()}`)
                            .setDescription(`Hello <@${user.id}>, welcome to your ticket!\n\n**Staff will be with you in a short period, please wait.**\n\nPlease explain your issue in detail while you wait.`)
                            .addFields({ name: '👤 Owner', value: `<@${user.id}>`, inline: true }, { name: '📂 Category', value: category, inline: true })
                            .setFooter({ text: 'REZERO-MD Staff Controls' });

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder().setCustomId('claim_ticket').setLabel('Claim').setEmoji('🧑‍💼').setStyle(ButtonStyle.Success),
                                new ButtonBuilder().setCustomId('lock_ticket').setLabel('Lock').setEmoji('🔒').setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder().setCustomId('save_ticket').setLabel('Save').setEmoji('💾').setStyle(ButtonStyle.Primary),
                                new ButtonBuilder().setCustomId('close_ticket').setLabel('Close').setEmoji('🧹').setStyle(ButtonStyle.Danger)
                            );

                        await channel.send({ 
                            content: process.env.STAFF_ROLE_ID ? `<@&${process.env.STAFF_ROLE_ID}> a new ticket has been opened!` : 'A new ticket has been opened!', 
                            embeds: [welcomeEmbed], 
                            components: [row] 
                        });
                        console.log(`[Ticket] Welcome message sent to: ${channel.id}`);
                    } catch (err) {
                        console.error('[Ticket] Error sending welcome message:', err);
                        // We don't return here because the channel is already created
                    }

                    try {
                        // 3. Save to DB
                        if (!client.db.data.tickets) client.db.data.tickets = {};
                        client.db.data.tickets[channel.id] = {
                            channelId: channel.id,
                            ownerId: user.id,
                            category: category,
                            status: 'open',
                            createdAt: Date.now()
                        };
                        await client.db.save();
                        console.log(`[Ticket] Data saved to DB for: ${channel.id}`);
                    } catch (err) {
                        console.error('[Ticket] Error saving to DB:', err);
                    }
                    
                    // 4. Finalize the interaction
                    return await interaction.editReply({ content: `✅ Ticket created: ${channel}` });
                }
            }
        } catch (error) {
            console.error('Interaction Error:', error);
            try {
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({ content: '❌ An error occurred while processing this interaction.' });
                } else {
                    await interaction.reply({ content: '❌ An error occurred while processing this interaction.', ephemeral: true });
                }
            } catch (e) {}
        }
    }
};
