const axios = require('axios');

/**
 * REZERO-MD Command: translate
 * Category: Tools
 * Translate text to different languages
 */

module.exports = {
    name: 'translate',
    category: 'Tools',
    description: 'Translate text to another language',
    usage: '.translate <lang_code> <text>',
    ownerOnly: false,

    async execute(client, message, args) {
        if (args.length < 2) {
            return message.reply('❌ Please provide language code and text!\nUsage: .translate <lang_code> <text>\nExample: .translate es Hello World');
        }

        const targetLang = args[0];
        const text = args.slice(1).join(' ');

        try {
            const response = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
            const translation = response.data.responseData.translatedText;

            await message.reply(`
🌍 *TRANSLATOR*

📝 Original: ${text}
🔤 Language: ${targetLang.toUpperCase()}
✅ Translation: ${translation}
            `.trim());
        } catch (error) {
            await message.reply('❌ Translation failed! Please check the language code.\nCommon codes: es (Spanish), fr (French), de (German), ja (Japanese)');
        }
    }
};
