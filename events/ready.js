module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`✅ ${client.user.tag} is online!`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Watching ${client.users.cache.size} users`);
        
        client.user.setActivity(`${process.env.PREFIX}help | REZERO-MD`, { type: 'PLAYING' });
    }
};
