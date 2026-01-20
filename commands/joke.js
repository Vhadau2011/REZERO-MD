/**
 * REZERO-MD Command: joke
 * Category: Fun
 * Sends a random joke
 */

module.exports = {
    name: 'joke',
    category: 'Fun',
    description: 'Get a random joke',
    usage: '.joke',
    ownerOnly: false,

    async execute(client, message, args) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "Why don't eggs tell jokes? They'd crack each other up!",
            "What do you call a fake noodle? An impasta!",
            "Why did the math book look so sad? Because it had too many problems!",
            "What do you call a bear with no teeth? A gummy bear!",
            "Why couldn't the bicycle stand up by itself? It was two tired!",
            "What do you call cheese that isn't yours? Nacho cheese!",
            "Why did the coffee file a police report? It got mugged!",
            "What's orange and sounds like a parrot? A carrot!"
        ];

        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        
        await message.reply(`😂 *RANDOM JOKE*\n\n${randomJoke}`);
    }
};
