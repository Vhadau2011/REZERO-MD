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
            await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
        } catch (error) {
            console.error('Error saving database:', error);
        }
    }

    getUser(userId) {
        if (!this.data.users[userId]) {
            this.data.users[userId] = {
                wallet: 1000,
                bank: 0,
                inventory: [],
                lastDaily: null,
                lastWeekly: null,
                lastWork: null,
                lastCrime: null,
                wins: 0,
                losses: 0,
                totalGambled: 0,
                level: 1,
                xp: 0
            };
        }
        return this.data.users[userId];
    }

    async updateUser(userId, data) {
        this.data.users[userId] = { ...this.getUser(userId), ...data };
        await this.save();
    }

    async addMoney(userId, amount, type = 'wallet') {
        const user = this.getUser(userId);
        user[type] += amount;
        await this.save();
        return user[type];
    }

    async removeMoney(userId, amount, type = 'wallet') {
        const user = this.getUser(userId);
        if (user[type] < amount) return false;
        user[type] -= amount;
        await this.save();
        return true;
    }

    async addItem(userId, item) {
        const user = this.getUser(userId);
        user.inventory.push(item);
        await this.save();
    }

    async removeItem(userId, itemName) {
        const user = this.getUser(userId);
        const index = user.inventory.findIndex(i => i.name === itemName);
        if (index === -1) return false;
        user.inventory.splice(index, 1);
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
            .sort((a, b) => b[1][type] - a[1][type])
            .slice(0, limit);
    }
}

module.exports = Database;
