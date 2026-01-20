> I have received your message and am continuing with the final steps. I apologize for any perceived delay. I am now creating the final documentation before delivering the complete bot project to you.

# REZERO-MD Discord Bot

A powerful Economy and Gambling Discord bot with 50+ commands, a private ticket system, and a configurable shop.

## 🚀 Features

- **50+ Commands**: Including Economy, Gambling, Fun, Utility, and Moderation.
- **Channel-Locked Gambling**: 5 core gambling commands are restricted to specific channels.
- **Private Ticket System**: Secure support tickets with access control for owners and guards.
- **Economy System**: Wallet, Bank, Daily/Weekly rewards, Work, and Crime.
- **Shop System**: Buy and sell items, including role-based rewards.
- **JSON Database**: Lightweight and easy-to-manage data storage.

## 🛠️ Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16.11.0 or higher)
- A Discord Bot Token from the [Discord Developer Portal](https://discord.com/developers/applications)

### 2. Installation
1. Clone or download this repository.
2. Open a terminal in the project folder.
3. Install dependencies:
   ```bash
   npm install
   ```

### 3. Configuration
Create a `.env` file in the root directory (you can use `.env.example` as a template):

```env
TOKEN=your_bot_token_here
PREFIX=.
OWNER_ID=your_discord_id

# Gambling Channels (Only these channels can use .slot, .bet, .gamble, .rolate, .coinflip)
GAMBLING_CHANNEL_1=123456789012345678
GAMBLING_CHANNEL_2=876543210987654321

# Guards (Users who can access tickets and use moderation commands)
GUARDS_ID=id1,id2,id3

# Database Path
DATABASE_PATH=./data/database.json
```

### 4. Running the Bot
```bash
npm start
```

## 🎮 Command List

### 🎰 Gambling (Channel-Locked)
*These only work in the channels set in your .env file:*
- `.slot <amount>` - Play the slot machine
- `.bet <amount>` - 50/50 bet
- `.gamble <amount>` - High-risk gambling
- `.rolate <amount> <red/black/green>` - Roulette
- `.coinflip <amount> <heads/tails>` - Flip a coin

### 🎫 Ticket System
- `.topen [reason]` - Open a private support ticket
- `.tclose [reason]` - Close the ticket (works only inside the ticket channel)

### 💰 Economy
- `.bal` - Check balance
- `.daily` - Claim daily reward
- `.weekly` - Claim weekly reward
- `.work` - Work for money
- `.crime` - Commit a crime
- `.dep <amount>` - Deposit to bank
- `.wd <amount>` - Withdraw from bank
- `.give @user <amount>` - Give money to someone
- `.lb` - Richest users leaderboard
- `.profile` - View your stats
- `.inv` - View your items
- `.rob @user` - Try to rob someone

### 🏪 Shop
- `.shop` - View available items
- `.buy <item_id>` - Purchase an item
- `.sell <item_name>` - Sell an item back
- `.additem` - (Owner Only) Add item to shop
- `.removeitem` - (Owner Only) Remove item from shop

### 🎮 Fun & Games
- `.blackjack <amount>` - Play 21
- `.dice <amount> <guess>` - Roll the dice
- `.rps <amount> <choice>` - Rock Paper Scissors
- `.highlow <amount> <guess>` - Higher or Lower
- `.guess <amount> <number>` - Guess the number
- `.wheel <amount>` - Spin the wheel
- `.scratch <amount>` - Scratch card
- `.race <amount>` - Race against others
- `.crash <amount> <multiplier>` - Crash game
- `.mines <amount>` - Minesweeper gambling
- `.fight @user <amount>` - Duel another user
- `.trivia` - Answer questions for money

### 🛠️ Utility & Moderation
- `.help` - Show all commands
- `.ping` - Check bot latency
- `.stats` - Bot statistics
- `.serverinfo` - Server details
- `.userinfo` - User details
- `.avatar` - Get user avatar
- `.clear <amount>` - (Guards Only) Delete messages
- `.kick @user` - (Guards Only) Kick user
- `.ban @user` - (Guards Only) Ban user
- `.mute @user` - (Guards Only) Timeout user
- `.unmute @user` - (Guards Only) Remove timeout

## 📝 Notes
- The bot uses **discord.js v14**.
- All data is saved in `data/database.json`.
- Ensure the bot has `Administrator` permissions or at least `Manage Channels` and `Manage Roles` for the ticket system to work correctly.
