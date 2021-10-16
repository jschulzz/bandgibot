# Bandgibot

Bandgibot is a simple, silly service for a Groupme chat. This includes a group char bot, and an [associated website](https://bandgibot.net) on which users can interact further with the service.

## Bot

The bot handles a couple responsibilities, such as:

* maintaining a running tally of user kicks
* sending happy birthday messages
* checking if Duke basketball lost
* maintaining a record of Karma points (meainingless points we can freely add/remove to other members or things)

### Cronjobs

Some events happen on a regular basis. This is handled with Cronjobs, set to run on set intervals.
Adding one of these is as simple as adding a function (in its own file) for the process, then importing and starting it in the `server.js`

### OnMessage Events

There are some events that need to react to messages sent in the chat (or system events like kicks). 
These are also separated out into their own files, and called within the main server `/chatbot` POST request.

## Bandgibot.net

Bandgibot.net is the front-end of the bot. Here, users can see the Karma leaderboard, as well as submit superlatives (congradulatory messages sent when user reach certain karma scores).

## Deployment

There is a simple `/bin/deploy.sh` script which handles deploying the new code on the AWS EC2 instance. This script:

* pulls the latest code
* installs dependencies
* creates the production build for the front-end
* restarts the PM2 process for running the server (both the bot and front-end)

Deployment is handled in a Github Action upon pushes to the `main` branch.

## Contributing

If you want to contribute (restricted to group chat members only at the moment) make a PR, and I'll take a look
