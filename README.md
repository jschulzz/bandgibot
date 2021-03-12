# Bandgibot

A simple, silly bot for a groupchat. It does things like track how many times someone's been kicked, check if Duke lost, and celebrate birthdays.

## Event Types

### Cronjobs

Some events happen on a regular basis. This is handled with Cronjobs, set to run on set intervals

Adding one of these is as simple as adding a function (in its own file) for the process, then importing and starting it in the `server.js`

### OnMessage Events

There are some events that need to be reactive to messages sent in the chat (or system events like kicks). 
These are also separated out into their own files, and called within the main server post request. Some events will send a message to the chat, but some won't

## Contributing

If you want to contribute (restricted to group chat members only at the moment) make a PR, and I'll take a look
