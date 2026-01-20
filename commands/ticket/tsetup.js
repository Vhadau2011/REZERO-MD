const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'tsetup',
    description: 'Setup the ticket panel (Owner only)',
    async execute(message, args, client) {
        if (message.author.id !== process.env.OWNER_ID) {
            return message.reply('❌ Only the bot owner can use this command!');
        }

        const embed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle('📩 Support Ticket System')
            .setDescription('Need help? Click the button below to open a ticket!\n\n**Categories:**\n🛠️ Support\n🚩 Report\n💰 Buy\n⚖️ Appeal\n❓ Other')
            .setFooter({ text: 'REZERO-MD Support System' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('open_ticket')
                    .setLabel('Open Ticket')
                    .setEmoji('🎫')
                    .setStyle(ButtonStyle.Primary)
            );

        const channelId = process.env.TICKET_PANEL_CHANNEL_ID || message.channel.id;
        const channel = client.channels.cache.get(channelId) || message.channel;

        await channel.send({ embeds: [embed], components: [row] });
        message.reply(`✅ Ticket panel has been sent to <#${channel.id}>`);
    }
};
