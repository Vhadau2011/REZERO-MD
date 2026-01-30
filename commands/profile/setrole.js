module.exports = {
    name: 'setrole',
    category: 'profile',
    description: 'Set a user\'s system role (OWNER/TESTER/MOD)',
    async execute(message, args, client) {
        const ownerId = process.env.OWNER_ID;
        
        if (message.author.id !== ownerId) {
            return message.reply('❌ Only the Bot Owner can use this command!');
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❌ Please mention a user! Usage: `.setrole @user <ROLE>`');
        }

        const role = args[1]?.toUpperCase();
        const validRoles = ['OWNER', 'TESTER', 'MOD', 'USER'];

        if (!role || !validRoles.includes(role)) {
            return message.reply(`❌ Invalid role! Valid roles: ${validRoles.join(', ')}`);
        }

        await client.db.setRole(target.id, role);
        message.reply(`✅ Successfully set ${target.username}'s role to **${role}**.`);
    }
};
