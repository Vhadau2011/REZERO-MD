const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'trivia',
    description: 'Answer trivia questions for money',
    async execute(message, args, client) {
        const questions = [
            { q: 'What is 2 + 2?', a: ['4', 'four'], reward: 100 },
            { q: 'What color is the sky?', a: ['blue'], reward: 100 },
            { q: 'How many days in a week?', a: ['7', 'seven'], reward: 100 },
            { q: 'What is the capital of France?', a: ['paris'], reward: 200 },
            { q: 'How many continents are there?', a: ['7', 'seven'], reward: 150 },
            { q: 'What is H2O?', a: ['water'], reward: 150 },
            { q: 'Who painted the Mona Lisa?', a: ['leonardo da vinci', 'da vinci', 'leonardo'], reward: 250 },
            { q: 'What year did World War 2 end?', a: ['1945'], reward: 300 }
        ];

        const question = questions[getRandomInt(0, questions.length - 1)];

        const embed = {
            color: 0x00aaff,
            title: '❓ TRIVIA QUESTION',
            description: question.q,
            fields: [
                {
                    name: '💰 Reward',
                    value: `$${formatMoney(question.reward)}`,
                    inline: true
                },
                {
                    name: '⏰ Time Limit',
                    value: '15 seconds',
                    inline: true
                }
            ],
            footer: {
                text: 'Type your answer in chat!',
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        await message.reply({ embeds: [embed] });

        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 15000, max: 1 });

        collector.on('collect', async m => {
            const answer = m.content.toLowerCase().trim();
            
            if (question.a.includes(answer)) {
                await client.db.addMoney(message.author.id, question.reward);
                const newBalance = client.db.getUser(message.author.id).wallet;

                const successEmbed = {
                    color: 0x00ff00,
                    title: '✅ CORRECT!',
                    description: `You earned **$${formatMoney(question.reward)}**!`,
                    fields: [
                        {
                            name: '💵 New Balance',
                            value: `$${formatMoney(newBalance)}`,
                            inline: true
                        }
                    ],
                    footer: {
                        text: `${message.author.tag}`,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                };

                m.reply({ embeds: [successEmbed] });
            } else {
                const failEmbed = {
                    color: 0xff0000,
                    title: '❌ WRONG!',
                    description: `The correct answer was: **${question.a[0]}**`,
                    footer: {
                        text: `${message.author.tag}`,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                };

                m.reply({ embeds: [failEmbed] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                message.reply('⏰ Time\'s up! You didn\'t answer in time.');
            }
        });
    }
};
