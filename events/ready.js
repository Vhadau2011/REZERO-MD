const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ ${client.user.tag} is online!`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Watching ${client.users.cache.size} users`);
        
        client.user.setActivity(`${process.env.PREFIX}help | REZERO-MD`, { type: 'PLAYING' });

        // Auto-send Ticket Panel on Startup
        const panelChannelId = process.env.TICKET_PANEL_CHANNEL_ID;
        if (panelChannelId) {
            try {
                const channel = await client.channels.fetch(panelChannelId);
                if (channel) {
                    const embed = new EmbedBuilder()
                        .setColor(0x2f3136)
                        .setTitle('Support Tickets')
                        .setDescription('To create a ticket use the Create ticket button')
                        .setFooter({ text: 'TicketTool.xyz - Ticketing without clutter' });

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('open_ticket')
                                .setLabel('Create ticket')
                                .setEmoji('📩')
                                .setStyle(ButtonStyle.Secondary)
                        );

                    await channel.send({ embeds: [embed], components: [row] });
                    console.log(`✅ Ticket panel automatically sent to channel: ${panelChannelId}`);
                }
            } catch (error) {
                console.error('❌ Error sending ticket panel on startup:', error);
            }
        }
    }
};
