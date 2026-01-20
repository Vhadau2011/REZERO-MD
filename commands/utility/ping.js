module.exports = {
    name: 'ping',
    description: 'Check bot latency',
    async execute(message, args, client) {
        const sent = await message.reply('🏓 Pinging...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        const embed = {
            color: 0x00ff00,
            title: '🏓 Pong!',
            fields: [
                {
                    name: '📡 Bot Latency',
                    value: `${latency}ms`,
                    inline: true
                },
                {
                    name: '🌐 API Latency',
                    value: `${apiLatency}ms`,
                    inline: true
                }
            ],
            footer: {
                text: `${message.author.tag}`,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        sent.edit({ content: '', embeds: [embed] });
    }
};
