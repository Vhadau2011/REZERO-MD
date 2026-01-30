module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        
        const prefix = process.env.PREFIX || '.';
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) return;

        // Royal Card Check for Economy and Gambling commands
        if (command.category === 'economy' || command.category === 'gambling') {
            const user = client.db.getUser(message.author.id, message.author.username);
            
            if (!user.info.registered) {
                return message.reply("⚠️ Sorry, you don't have a Royal Card. Please register first using `.reg <age>`.");
            }
            
            if (user.info.banned) {
                return message.reply("🚫 Your Royal Card is currently banned. You cannot use economy or gambling commands.");
            }
        }

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            message.reply('❌ There was an error executing that command!').catch(console.error);
        }
    }
};
