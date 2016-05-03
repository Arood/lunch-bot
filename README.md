![Build status](http://strider.mothership.odtag.se/arood/lunch-bot/badge?branch=master)

# lunch-bot

Lunch-bot for the Adeprimo Slack team. It downloads a bunch of web pages and run them through the jsdom module, which allows us to more easily retrieve the content we're interested in.

## Usage

First install necessary modules: `npm install`

Add your own sources or set the schedule for posting in index.js.

## Run as a bot

First you need to setup an [Incoming WebHook](https://api.slack.com/incoming-webhooks) for your Slack team. Next, create a `secret.json` file, where you'll put an URL for your webhook.

When you have done that, you should be able to start the bot by running `npm start`.

## Run for testing

If you want to add sources you probably want to run this script in the test mode. I've been a bit naughty and configured `npm test` for this.

When you run `npm test`, the script will run the scraping phase and output the results in your console. It will skip posting the result to Slack, so you can run it without spamming. It should look something like this:

```
Test-mode

🔍  Scraping http://www.mcdonalds.se/se/pa-mcdonalds/kampanj/2015/mclunch.html

[ Object {
    title: 'McDonalds',
    value: 'McFeast & Co / Chicken & Bacon McWrap',
    short: true } ]
```
