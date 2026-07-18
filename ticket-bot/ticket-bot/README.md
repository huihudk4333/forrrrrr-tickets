# Discord Ticket Bot

A full support-ticket bot: dropdown category selector, embeds, claim/close buttons,
a "close with reason" modal, and automatic transcripts.

## Features
- `/ticket-panel` posts an embed with a **dropdown menu** of ticket categories
- Picking a category creates a private channel visible only to the user + support role
- Ticket channel has **Claim**, **Close**, and **Close with Reason** buttons
- Closing generates a **text transcript**, posts it to a log channel, and DMs the user a copy
- Per-user open ticket limit (configurable)
- No database required — ticket ownership is stored in the channel topic

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Discord application
1. Go to https://discord.com/developers/applications → **New Application**
2. **Bot** tab → **Reset Token**, copy it
3. Under **Privileged Gateway Intents**, enable **Server Members Intent** and **Message Content Intent**
4. **OAuth2 → URL Generator**: scopes `bot` + `applications.commands`; permissions: Manage Channels, Send Messages, Embed Links, Attach Files, Read Message History, Manage Roles (if using overwrites). Use the generated URL to invite the bot.

### 3. Configure environment
```bash
cp .env.example .env
```
Fill in:
- `DISCORD_TOKEN` — your bot token
- `CLIENT_ID` — your application's Client ID (General Information tab)
- `GUILD_ID` — your server ID (optional but recommended for instant command updates in dev — right-click your server icon → Copy Server ID, with Developer Mode on)

### 4. Configure the bot (`config.json`)
- `supportRoleIds` — role(s) that can see/claim/close all tickets
- `ticketCategoryId` — the Discord channel **category** new ticket channels get created under
- `transcriptLogChannelId` — channel where closed-ticket transcripts are posted
- `categories` — edit/add/remove dropdown options (each needs a unique `id`)

Right-click any role/channel/category with Developer Mode on → **Copy ID**.

### 5. Deploy slash commands
```bash
npm run deploy
```

### 6. Start the bot
```bash
npm start
```

### 7. Post the panel
In any channel, run `/ticket-panel` (requires Manage Channels permission). This posts the
dropdown embed users interact with to open tickets.

## File structure
```
ticket-bot/
├── index.js              # entry point
├── deploy-commands.js    # registers slash commands
├── config.json           # categories, roles, channels — edit this to customize
├── commands/
│   ├── panel.js           # /ticket-panel
│   └── close.js           # /close [reason]
├── events/
│   ├── ready.js
│   └── interactionCreate.js  # handles dropdown, buttons, modal
└── utils/
    ├── ticketManager.js   # create/claim/close logic
    └── transcript.js      # plain-text transcript generator
```

## Notes
- Ticket ownership is tracked via the channel's **topic** field (`ticket|<userId>|<categoryId>`), so there's no database to maintain, but manually editing a ticket channel's topic will break tracking.
- The channel deletes itself a few seconds after closing (`closeCountdownSeconds` in config); transcripts are sent before that happens, so nothing is lost.
- Anyone with the support role, or the ticket opener, can close a ticket; only support (or Manage Channels) can claim.
