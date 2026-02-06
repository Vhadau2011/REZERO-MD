const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "pps",
  category: "moderation",
  async execute(message, args, client) {

    const OWNER_ID = process.env.OWNER || "1456281647400882290"; // set in .env
    const GUARDS_IDS = process.env.GUARDS ? process.env.GUARDS.split(",") : []; // comma separated IDs in .env

    // Permission check
    if (![OWNER_ID, ...GUARDS_IDS].includes(message.author.id)) {
      return message.reply("❌ You do not have permission to use this command. Only OWNER or GUARDS can use it.");
    }

    // Check for ad text
    if (!args.length) {
      return message.reply("❌ Please provide the partnership message. Usage: `.pps <message>`");
    }

    const adMessage = args.join(" ");

    // Target channel and role
    const CHANNEL_ID = "1467956460016111852";
    const ROLE_ID = "1467047729145319528";

    const channel = message.guild.channels.cache.get(CHANNEL_ID);
    if (!channel) return message.reply("❌ Partnership channel not found.");

    // Embed
    const embed = new EmbedBuilder()
      .setColor(0xf1c30f) // cool blue
      .setTitle("🤝Privet Partnership Announcement")
      .setDescription(adMessage)
      .setFooter({ text: `Partnership posted by ${message.author.tag}` })
      .setTimestamp();

    // Send embed and tag the role
    await channel.send({ content: `@evryone`, embeds: [embed] });

    // Confirmation
    message.reply("✅ Partnership message sent successfully.");
  }
};
