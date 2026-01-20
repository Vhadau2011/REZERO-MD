const fs = require('fs');
const path = require('path');

/**
 * REZERO-MD Command: setprefix
 * Category: Owner
 * Changes the bot command prefix (owner only)
 */

module.exports = {
    name: 'setprefix',
    category: 'Owner',
    description: 'Change the bot command prefix',
    usage: '.setprefix <new_prefix>',
    ownerOnly: true,

    async execute(client, message, args) {
        if (args.length === 0) {
            return message.reply('❌ Please provide a new prefix!\nUsage: .setprefix <new_prefix>');
        }

        const newPrefix = args[0];
        
        // Update .env file
        const envPath = path.resolve('.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        if (envContent.includes('PREFIX=')) {
            envContent = envContent.replace(/PREFIX=.*/, `PREFIX=${newPrefix}`);
        } else {
            envContent += `\nPREFIX=${newPrefix}`;
        }
        
        fs.writeFileSync(envPath, envContent);
        
        await message.reply(`✅ Prefix changed to: ${newPrefix}\n\n⚠️ Restart the bot for changes to take effect.`);
    }
};
