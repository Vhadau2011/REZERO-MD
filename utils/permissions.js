require('dotenv').config();

function isOwner(userId) {
    return userId === process.env.OWNER_ID;
}

function isGuard(userId) {
    const guards = process.env.GUARDS_ID ? process.env.GUARDS_ID.split(',') : [];
    return guards.includes(userId) || isOwner(userId);
}

function isGamblingChannel(channelId) {
    const channel1 = process.env.GAMBLING_CHANNEL_1;
    const channel2 = process.env.GAMBLING_CHANNEL_2;
    return channelId === channel1 || channelId === channel2;
}

function formatMoney(amount) {
    return amount.toLocaleString();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCooldownTime(lastTime, cooldown) {
    if (!lastTime) return 0;
    const timePassed = Date.now() - lastTime;
    const timeLeft = cooldown - timePassed;
    return timeLeft > 0 ? timeLeft : 0;
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

module.exports = {
    isOwner,
    isGuard,
    isGamblingChannel,
    formatMoney,
    getRandomInt,
    getCooldownTime,
    formatTime
};
