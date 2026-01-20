module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        if (!message.content.startsWith(process.env.PREFIX)) return;

        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            message.reply('❌ There was an error executing that command!').catch(console.error);
        }
    }
};
