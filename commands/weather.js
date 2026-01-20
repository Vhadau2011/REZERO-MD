const axios = require('axios');

/**
 * REZERO-MD Command: weather
 * Category: Tools
 * Get weather information for a city
 */

module.exports = {
    name: 'weather',
    category: 'Tools',
    description: 'Get weather information',
    usage: '.weather <city>',
    ownerOnly: false,

    async execute(client, message, args) {
        if (args.length === 0) {
            return message.reply('❌ Please provide a city name!\nUsage: .weather <city>');
        }

        const city = args.join(' ');

        try {
            const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
            const data = response.data;
            const current = data.current_condition[0];
            const location = data.nearest_area[0];

            const weatherMsg = `
🌤️ *WEATHER INFORMATION*

📍 Location: ${location.areaName[0].value}, ${location.country[0].value}
🌡️ Temperature: ${current.temp_C}°C / ${current.temp_F}°F
☁️ Condition: ${current.weatherDesc[0].value}
💨 Wind: ${current.windspeedKmph} km/h
💧 Humidity: ${current.humidity}%
👁️ Visibility: ${current.visibility} km
            `.trim();

            await message.reply(weatherMsg);
        } catch (error) {
            await message.reply('❌ Failed to get weather information! Please check the city name.');
        }
    }
};
