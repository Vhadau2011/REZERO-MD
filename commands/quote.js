/**
 * REZERO-MD Command: quote
 * Category: Fun
 * Sends a random inspirational quote
 */

module.exports = {
    name: 'quote',
    category: 'Fun',
    description: 'Get a random inspirational quote',
    usage: '.quote',
    ownerOnly: false,

    async execute(client, message, args) {
        const quotes = [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Innovation distinguishes between a leader and a follower. - Steve Jobs",
            "Life is what happens when you're busy making other plans. - John Lennon",
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "It is during our darkest moments that we must focus to see the light. - Aristotle",
            "The only impossible journey is the one you never begin. - Tony Robbins",
            "In this life we cannot do great things. We can only do small things with great love. - Mother Teresa",
            "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
            "Believe you can and you're halfway there. - Theodore Roosevelt",
            "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb"
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        await message.reply(`💭 *INSPIRATIONAL QUOTE*\n\n_${randomQuote}_`);
    }
};
