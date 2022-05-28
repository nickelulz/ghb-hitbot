# The Glasshouse Bar Personal Minecraft Server Bot

This bot acts in parallel to a personal minecraft server.

## How to configure the bot:
* Edit any public (preset) constants in `constants.ts`.
* Edit any private (non-preset) environment constants in `.env` (see `.env.example` for an example.)

### TO DO:
1. Server start command (exec -> spawn)
2. Admin registry editing commands
3. Claiming hits (completed and verified hits go into completed_hits.json)

## Commands List:
All-Access
* hello
* register
* listregisteredplayers
* listonlineplayers
* listbounties
* leaderboards
* help
* serverinfo
* status
* listbounties

Registered Only
* contract
* bounty
* deregister

Admin Only
* editplayerdata
* start

Root Admin Only
* admin

## Ideal Commands List:

All-Access
* help
* hello
* leaderboards
* listbounties
* players
* register [ign: ign]
* playerstatus [player: playername]
* serverinfo
* serverstatus

Registered Only
* contract [mode: set/remove/claim/accept/deny] [?target: playername] [?contractor: playername] [?hirer: playername] [?price: value]
* bounty [mode: set/remove/claim] [?target: playername] [?hirer: playername] [?price: value]
* deregister

Admin Only
* start
* editplayerdata [player: playername] [mode: kills/deaths] [newvalue: value]

Root Admin Only
* admin [mode: give/remove] [user: playername]
