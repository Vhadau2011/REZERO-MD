/**
 * REZERO-MD Command: truth
 * Category: Fun
 * Sends a random truth question
 */

module.exports = {
    name: 'truth',
    category: 'Fun',
    description: 'Get a random truth question',
    usage: '.truth',
    ownerOnly: false,

    async execute(client, message, args) {
        const truths = [
            "What is your biggest fear?",
            "What is the most embarrassing thing you've ever done?",
            "Have you ever lied to your best friend?",
            "What is your biggest secret?",
            "Who was your first crush?",
            "What is something you've never told anyone?",
            "What is your most embarrassing moment?",
            "Have you ever cheated on a test?",
            "What is the worst thing you've ever said to someone?",
            "What is your biggest regret?"
        ];

        const randomTruth = truths[Math.floor(Math.random() * truths.length)];
        
        await message.reply(`🤔 *TRUTH QUESTION*\n\n${randomTruth}`);
    }
};
