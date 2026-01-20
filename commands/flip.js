/**
 * REZERO-MD Command: flip
 * Category: Fun
 * Flips a coin
 */

module.exports = {
    name: 'flip',
    category: 'Fun',
    description: 'Flip a coin',
    usage: '.flip',
    ownerOnly: false,

    async execute(client, message, args) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '🪙';

        await message.reply(`${emoji} *COIN FLIP*\n\nResult: *${result}*`);
    }
};
