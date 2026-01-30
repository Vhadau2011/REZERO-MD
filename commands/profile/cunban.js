module.exports = {
    name: 'cunban',
    category: 'profile',
    description: 'Unban a user\'s Royal Card',
    async execute(message, args, client) {
        const user = client.db.getUser(message.author.id);
        const isOwner = message.author.id === process.env.OWNER_ID;
        const isMod = user.info.role === 'MOD' || user.info.role === 'OWNER';

        if (!isOwner && !isMod) {
            return message.reply('❌ You don\'t have permission to use this command!');
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❌ Please mention a user! Usage: `.cunban @user`');
        }

        await client.db.setBan(target.id, false);
        message.reply(`✅ Successfully unbanned ${target.username}'s Royal Card.`);
    }
};
