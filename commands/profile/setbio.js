module.exports = {
    name: 'setbio',
    category: 'profile',
    description: 'Set your Royal Card bio',
    async execute(message, args, client) {
        const user = client.db.getUser(message.author.id, message.author.username);
        
        if (!user.info.registered) {
            return message.reply('⚠️ Sorry, you don\'t have a Royal Card. Please register first using `.reg <age>`.');
        }

        if (!args[0]) {
            return message.reply('❌ Please provide a bio! Usage: `.setbio <your bio>`');
        }

        const bio = args.join(' ');
        if (bio.length > 100) {
            return message.reply('❌ Bio is too long! Maximum 100 characters.');
        }

        await client.db.setBio(message.author.id, bio);
        message.reply('✅ Your Royal Card bio has been updated!');
    }
};
