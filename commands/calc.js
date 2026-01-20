/**
 * REZERO-MD Command: calc
 * Category: Tools
 * Simple calculator
 */

module.exports = {
    name: 'calc',
    category: 'Tools',
    description: 'Calculate mathematical expressions',
    usage: '.calc <expression>',
    ownerOnly: false,

    async execute(client, message, args) {
        if (args.length === 0) {
            return message.reply('❌ Please provide a mathematical expression!\nUsage: .calc <expression>\nExample: .calc 5 + 3 * 2');
        }

        const expression = args.join(' ');

        try {
            // Safe evaluation using Function constructor
            const result = Function(`'use strict'; return (${expression})`)();
            
            if (typeof result !== 'number' || isNaN(result)) {
                throw new Error('Invalid expression');
            }

            await message.reply(`
🧮 *CALCULATOR*

📝 Expression: ${expression}
✅ Result: ${result}
            `.trim());
        } catch (error) {
            await message.reply('❌ Invalid mathematical expression!\nExample: .calc 5 + 3 * 2');
        }
    }
};
