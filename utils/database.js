const fs = require('fs').promises;
const path = require('path');

class Database {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = {
            users: {},
            shop: {},
            lottery: {
                pot: 0,
                tickets: []
            },
            tickets: {}
        };
    }

    async load() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            this.data = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.save();
            } else {
                console.error('Error loading database:', error);
            }
        }
    }

    async save() {
        try {
            // Sort users by ID for easier manual modification as requested
            const sortedUsers = {};
            Object.keys(this.data.users).sort().forEach(key => {
                sortedUsers[key] = this.data.users[key];
            });
            this.data.users = sortedUsers;

            await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
        } catch (error) {
            console.error('Error saving database:', error);
        }
    }

    getUser(userId, username = 'Unknown') {
        if (!this.data.users[userId]) {
            this.data.users[userId] = {
                info: {
                    id: userId,
                    name: username,
                    registered: false,
                    banned: false,
                    role: 'USER',
                    bio: 'No bio set.',
                    age: 'Not set'
                },
                economy: {
                    wallet: 1000,
                    bank: 0,
                    inventory: [],
                    lastDaily: null,
                    lastWeekly: null,
                    lastWork: null,
                    lastCrime: null
                },
                stats: {
                    wins: 0,
                    losses: 0,
                    totalGambled: 0,
                    level: 1,
                    xp: 0
                }
            };
        } else {
            // Ensure new structure exists for old users
            if (!this.data.users[userId].info) {
                const oldData = this.data.users[userId];
                this.data.users[userId] = {
                    info: {
                        id: userId,
                        name: username,
                        registered: false,
                        banned: false,
                        role: 'USER',
                        bio: 'No bio set.',
                        age: 'Not set'
                    },
                    economy: {
                        wallet: oldData.wallet || 1000,
                        bank: oldData.bank || 0,
                        inventory: oldData.inventory || [],
                        lastDaily: oldData.lastDaily || null,
                        lastWeekly: oldData.lastWeekly || null,
                        lastWork: oldData.lastWork || null,
                        lastCrime: oldData.lastCrime || null
                    },
                    stats: {
                        wins: oldData.wins || 0,
                        losses: oldData.losses || 0,
                        totalGambled: oldData.totalGambled || 0,
                        level: oldData.level || 1,
                        xp: oldData.xp || 0
                    }
                };
            }
            // Update name if provided and different
            if (username !== 'Unknown' && this.data.users[userId].info.name !== username) {
                this.data.users[userId].info.name = username;
            }
        }
        return this.data.users[userId];
    }

    async registerUser(userId, username, age) {
        const user = this.getUser(userId, username);
        user.info.registered = true;
        user.info.name = username;
        user.info.age = age;
        await this.save();
        return user;
    }

    async setRole(userId, role) {
        const user = this.getUser(userId);
        user.info.role = role;
        await this.save();
        return user;
    }

    async setBan(userId, status) {
        const user = this.getUser(userId);
        user.info.banned = status;
        await this.save();
        return user;
    }

    async setBio(userId, bio) {
        const user = this.getUser(userId);
        user.info.bio = bio;
        await this.save();
        return user;
    }

    async updateUser(userId, data) {
        // This is a generic update, might need to be more specific with nested objects
        const user = this.getUser(userId);
        // Deep merge logic could be added here if needed
        await this.save();
    }

    async addMoney(userId, amount, type = 'wallet') {
        const user = this.getUser(userId);
        user.economy[type] += amount;
        await this.save();
        return user.economy[type];
    }

    async removeMoney(userId, amount, type = 'wallet') {
        const user = this.getUser(userId);
        if (user.economy[type] < amount) return false;
        user.economy[type] -= amount;
        await this.save();
        return true;
    }

    async addItem(userId, item) {
        const user = this.getUser(userId);
        user.economy.inventory.push(item);
        await this.save();
    }

    async removeItem(userId, itemName) {
        const user = this.getUser(userId);
        const index = user.economy.inventory.findIndex(i => i.name === itemName);
        if (index === -1) return false;
        user.economy.inventory.splice(index, 1);
        await this.save();
        return true;
    }

    getShop() {
        return this.data.shop;
    }

    async addShopItem(id, item) {
        this.data.shop[id] = item;
        await this.save();
    }

    async removeShopItem(id) {
        delete this.data.shop[id];
        await this.save();
    }

    async createTicket(channelId, userId) {
        this.data.tickets[channelId] = {
            userId: userId,
            createdAt: Date.now()
        };
        await this.save();
    }

    async deleteTicket(channelId) {
        delete this.data.tickets[channelId];
        await this.save();
    }

    getTicket(channelId) {
        return this.data.tickets[channelId];
    }

    getLeaderboard(type = 'wallet', limit = 10) {
        return Object.entries(this.data.users)
            .sort((a, b) => (b[1].economy[type] || 0) - (a[1].economy[type] || 0))
            .slice(0, limit);
    }
}

module.exports = Database;
