# The Glasshouse Bar Personal Minecraft Server Bot

This is a discord bot that I developed for use alongside my personal minecraft server. It has three main functions: managing a 'hit' system wherein people can place assassinations on each other, starting a minecraft server executable, and supplying information about the server all through discord. 

### The 'Hit' System

The hit system on this bot was programmed with a few ideas in mind. Firstly, there are two types of hits: a 'public' hit (**Bounty**) and a private hit (**Contract**.) Bounties are open for anybody to claim but incur higher cooldowns and higher prices, and Contracts are secretive wherein a hirer negotiates with a specific person prior to placing the hit.

### Cooldowns

There are **3** types of cooldowns: placing a hit, being a contractor for a hit, and being targetted by a hit. Each one has a different default time (placing is 2 hours, contracting is 2 hours, and targetting is 4 hours) but these values can be changed by reconfiguring the bot.

## How to configure the bot:
* Edit any public (preset) constants in `constants.ts`.
* Edit any private (non-preset) environment constants in `.env` (see `.env.example` for an example.)

### TO DO:
1. Server start command (exec -> spawn)
2. Admin registry editing commands
3. Claiming hits (completed and verified hits go into completed_hits.json)

## Commands List:

All-Access
* help
* hello
* leaderboards
* players
* register [ign: playername]
* players [?ign: playername]
* serverinfo
* status

Registered Only
* contract [mode: set/remove/claim/accept/deny] [?target: playername] [?contractor: playername] [?hirer: playername] [?price: value]
* bounty [mode: set/remove/claim] [?target: playername] [?hirer: playername] [?price: value]
* counterclaim

Admin Only
* start
* editplayerdata [player: playername] [mode: kills/deaths] [newvalue: value]
* evaluateclaim [mode: verify/reject/list] [?ign: playername]

Root Admin Only
* admin [mode: give/remove] [ign: playername]
