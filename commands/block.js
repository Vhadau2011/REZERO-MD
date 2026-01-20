/**
 * REZERO-MD Command: block
 * Category: Owner
 * Blocks a user from using the bot (owner only)
 */

module.exports = {
    name: 'block',
    category: 'Owner',
    description: 'Block a user from using the bot',
    usage: '.block <@user or reply>',
    ownerOnly: true,

    async execute(client, message, args) {
        let targetNumber;

        // Check if replying to a message
        if (message.hasQuotedMsg) {
            const quotedMsg = await message.getQuotedMessage();
            targetNumber = quotedMsg.from;
        } 
        // Check if mentioned
        else if (message.mentionedIds && message.mentionedIds.length > 0) {
            targetNumber = message.mentionedIds[0];
        } 
        else {
            return message.reply('❌ Please mention a user or reply to their message!');
        }

        try {
            const contact = await client.getContactById(targetNumber);
            await contact.block();
            await message.reply(`✅ Successfully blocked: ${contact.pushname || targetNumber}`);
        } catch (error) {
            await message.reply(`❌ Failed to block user: ${error.message}`);
        }
    }
};
