const util = require('util');

/**
 * REZERO-MD Command: eval
 * Category: Owner
 * Evaluates JavaScript code (owner only - DANGEROUS!)
 */

module.exports = {
    name: 'eval',
    category: 'Owner',
    description: 'Execute JavaScript code',
    usage: '.eval <code>',
    ownerOnly: true,

    async execute(client, message, args) {
        if (args.length === 0) {
            return message.reply('❌ Please provide code to evaluate!');
        }

        const code = args.join(' ');

        try {
            let result = eval(code);
            
            if (typeof result !== 'string') {
                result = util.inspect(result, { depth: 0 });
            }

            await message.reply(`✅ *Eval Result:*\n\`\`\`${result}\`\`\``);
        } catch (error) {
            await message.reply(`❌ *Eval Error:*\n\`\`\`${error.message}\`\`\``);
        }
    }
};
