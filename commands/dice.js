/**
 * REZERO-MD Command: dice
 * Category: Fun
 * Rolls a dice
 */

module.exports = {
    name: 'dice',
    category: 'Fun',
    description: 'Roll a dice',
    usage: '.dice',
    ownerOnly: false,

    async execute(client, message, args) {
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        const roll = Math.floor(Math.random() * 6) + 1;
        const emoji = diceEmojis[roll - 1];

        await message.reply(`🎲 *DICE ROLL*\n\n${emoji} You rolled: *${roll}*`);
    }
};
