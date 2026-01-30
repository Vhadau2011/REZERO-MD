module.exports = {
    name: 'cban',
    category: 'profile',
    description: 'Ban a user\'s Royal Card',
    async execute(message, args, client) {
        const user = await client.db.getUser(message.author.id);
        const isOwner = message.author.id === process.env.OWNER_ID;
        const isMod = user.info.role === 'MOD' || user.info.role === 'OWNER';

        if (!isOwner && !isMod) {
            return message.reply('❌ You don\'t have permission to use this command!');
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❌ Please mention a user! Usage: `.cban @user`');
        }

        const targetData = await client.db.getUser(target.id);
        if (targetData.info.role === 'OWNER') {
            return message.reply('❌ You cannot ban the Owner!');
        }

        await client.db.setBan(target.id, true);
        message.reply(`🚫 Successfully banned ${target.username}'s Royal Card.`);
    }
};
