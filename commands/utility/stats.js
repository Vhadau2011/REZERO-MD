module.exports = {
    name: 'stats',
    description: 'Show bot statistics',
    async execute(message, args, client) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime) % 60;

        const embed = {
            color: 0x00aaff,
            title: '📊 Bot Statistics',
            fields: [
                {
                    name: '🤖 Bot',
                    value: `${client.user.tag}`,
                    inline: true
                },
                {
                    name: '⏰ Uptime',
                    value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
                    inline: true
                },
                {
                    name: '🌐 Servers',
                    value: `${client.guilds.cache.size}`,
                    inline: true
                },
                {
                    name: '👥 Users',
                    value: `${client.users.cache.size}`,
                    inline: true
                },
                {
                    name: '📝 Commands',
                    value: `${client.commands.size}`,
                    inline: true
                },
                {
                    name: '🏓 Ping',
                    value: `${Math.round(client.ws.ping)}ms`,
                    inline: true
                }
            ],
            footer: {
                text: `REZERO-MD`,
                icon_url: client.user.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
