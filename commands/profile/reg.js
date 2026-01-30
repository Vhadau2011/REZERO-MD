module.exports = {
    name: 'reg',
    category: 'profile',
    description: 'Register for a Royal Card',
    async execute(message, args, client) {
        const regChannelId = process.env.REG_CHANNEL;
        
        if (regChannelId && message.channel.id !== regChannelId) {
            return message.reply(`⚠️ Registration is only allowed in <#${regChannelId}>!`);
        }

        const user = await client.db.getUser(message.author.id, message.author.username);
        
        if (user.info.registered) {
            return message.reply('✅ You are already registered for a Royal Card!');
        }

        if (!args[0]) {
            return message.reply('❌ Please provide your age! Usage: `.reg <age>`');
        }

        const age = args[0];
        await client.db.registerUser(message.author.id, message.author.username, age);

        const embed = {
            color: 0x00ff00,
            title: '👑 Royal Card Registered',
            description: `Congratulations ${message.author.username}! Your Royal Card has been issued.\nUse \`.p\` to view it.`,
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
