const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isButton()) {
            // Handle Open Ticket Button
            if (interaction.customId === 'open_ticket') {
                // Check if user already has a ticket
                const existingTicket = Object.values(client.db.data.tickets || {}).find(t => t.ownerId === interaction.user.id && t.status === 'open');
                if (existingTicket) {
                    return interaction.reply({ content: `❌ You already have an open ticket: <#${existingTicket.channelId}>`, ephemeral: true });
                }

                // Show Category Selection
                const embed = new EmbedBuilder()
                    .setColor(0x00aaff)
                    .setTitle('Select a Category')
                    .setDescription('Please select the category that best fits your request.');

                const row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('select_category')
                            .setPlaceholder('Choose a category...')
                            .addOptions([
                                { label: 'Support', value: 'support', emoji: '🛠️' },
                                { label: 'Report', value: 'report', emoji: '🚩' },
                                { label: 'Buy', value: 'buy', emoji: '💰' },
                                { label: 'Appeal', value: 'appeal', emoji: '⚖️' },
                                { label: 'Other', value: 'other', emoji: '❓' },
                            ])
                    );

                await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            }

            // Handle Staff Controls
            if (['claim_ticket', 'lock_ticket', 'close_ticket', 'save_transcript'].includes(interaction.customId)) {
                const ticket = client.db.data.tickets[interaction.channel.id];
                if (!ticket) return interaction.reply({ content: '❌ Ticket data not found.', ephemeral: true });

                const staffRoleId = process.env.STAFF_ROLE_ID;
                if (!interaction.member.roles.cache.has(staffRoleId) && interaction.user.id !== process.env.OWNER_ID) {
                    return interaction.reply({ content: '❌ Only staff can use these controls!', ephemeral: true });
                }

                if (interaction.customId === 'claim_ticket') {
                    if (ticket.claimedBy) return interaction.reply({ content: '❌ This ticket is already claimed!', ephemeral: true });
                    
                    ticket.claimedBy = interaction.user.id;
                    await client.db.save();

                    const embed = EmbedBuilder.from(interaction.message.embeds[0])
                        .addFields({ name: '🧑‍💼 Claimed By', value: `<@${interaction.user.id}>`, inline: true });
                    
                    await interaction.message.edit({ embeds: [embed] });
                    await interaction.reply({ content: `✅ Ticket claimed by <@${interaction.user.id}>` });
                }

                if (interaction.customId === 'lock_ticket') {
                    await interaction.channel.permissionOverwrites.edit(ticket.ownerId, {
                        SendMessages: false
                    });
                    await interaction.reply({ content: '🔒 Ticket has been locked. The user can no longer send messages.' });
                }

                if (interaction.customId === 'close_ticket') {
                    await interaction.reply({ content: '🧹 Closing ticket in 5 seconds...' });
                    
                    // Generate Transcript (Simplified for this version)
                    const messages = await interaction.channel.messages.fetch({ limit: 100 });
                    let transcript = `Transcript for Ticket: ${interaction.channel.name}\nOwner: ${ticket.ownerId}\nCategory: ${ticket.category}\n\n`;
                    messages.reverse().forEach(m => {
                        transcript += `[${m.createdAt.toLocaleString()}] ${m.author.tag}: ${m.content}\n`;
                    });

                    // Log to channel
                    const logChannelId = process.env.TICKET_LOG_CHANNEL_ID;
                    const logChannel = client.channels.cache.get(logChannelId);
                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle('📄 Ticket Closed')
                            .addFields(
                                { name: 'Owner', value: `<@${ticket.ownerId}>`, inline: true },
                                { name: 'Category', value: ticket.category, inline: true },
                                { name: 'Closed By', value: `<@${interaction.user.id}>`, inline: true }
                            )
                            .setTimestamp();
                        
                        await logChannel.send({ embeds: [logEmbed] });
                        // In a real app, we'd attach the transcript file here
                    }

                    setTimeout(async () => {
                        delete client.db.data.tickets[interaction.channel.id];
                        await client.db.save();
                        await interaction.channel.delete();
                    }, 5000);
                }
            }
        }

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'select_category') {
                const category = interaction.values[0];
                const guild = interaction.guild;
                
                // Create Channel
                const channel = await guild.channels.create({
                    name: `ticket-${category}-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: process.env.TICKET_CATEGORY_ID || null,
                    permissionOverwrites: [
                        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                        { id: process.env.STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                        { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
                    ]
                });

                // Save to DB
                if (!client.db.data.tickets) client.db.data.tickets = {};
                client.db.data.tickets[channel.id] = {
                    channelId: channel.id,
                    ownerId: interaction.user.id,
                    category: category,
                    status: 'open',
                    createdAt: Date.now()
                };
                await client.db.save();

                // Send Welcome Message
                const welcomeEmbed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle(`Ticket: ${category.toUpperCase()}`)
                    .setDescription(`Hello <@${interaction.user.id}>, welcome to your ticket!\nStaff will be with you shortly. Please explain your issue in detail.`)
                    .addFields(
                        { name: '👤 Owner', value: `<@${interaction.user.id}>`, inline: true },
                        { name: '📂 Category', value: category, inline: true }
                    );

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('claim_ticket').setLabel('Claim').setEmoji('🧑‍💼').setStyle(ButtonStyle.Success),
                        new ButtonBuilder().setCustomId('lock_ticket').setLabel('Lock').setEmoji('🔒').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('close_ticket').setLabel('Close').setEmoji('🧹').setStyle(ButtonStyle.Danger)
                    );

                await channel.send({ content: `<@&${process.env.STAFF_ROLE_ID}> a new ticket has been opened!`, embeds: [welcomeEmbed], components: [row] });
                await interaction.update({ content: `✅ Ticket created: <#${channel.id}>`, embeds: [], components: [], ephemeral: true });
            }
        }
    }
};
