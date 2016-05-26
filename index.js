var request = require('request'),
		jsdom = require('jsdom'),
		schedule = require('node-schedule'),
		fs = require("fs"),
		util = require("util"),
		testMode = (process.argv.length > 2 && process.argv[2] == "test"),
		ls;

//
// General configuration
//

// The schedule for sending the message

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1, 2, 3, 4, 5];
rule.hour = 11;
rule.minute = 0;

// Sites to scrape for lunches

var lunchSources = [
	{ url: "http://lunchguide.nu/ostersund", js: "lunchguide.js" },
	{ url: "http://www.restaurangtrerum.se/veckans-lunchmeny/", js: "trerum.js" },
	{ url: "http://www.mcdonalds.se/se/pa-mcdonalds/kampanj/2015/mclunch.html", js: "mcdonalds.js" },
	{ url: "http://www.hosandreas.se/", js: "hosandreas.js" },
	{ url: "https://gist.github.com/madr/ada482c76a33aa6c012d", js: "skamborgen.js" }
];

//
// Magic
//

var getLunches = function(array, done) {

	var current = ls.shift();

	try {
		if (testMode) console.log("🔍  Scraping "+current.url);
		jsdom.env({
		  url: current.url,
			src: [fs.readFileSync("scripts/"+current.js, "utf-8")],
		  done: function (err, window) {
				if (window.scrapedField) {
					array.push(window.scrapedField);
				} else if (window.scrapedFields) {
					array = array.concat(window.scrapedFields);
				}
				window.close();
				if (ls.length > 0) {
					getLunches(array, done);
				} else {
					done(array);
				}
		  }
		});
	} catch (ex) {
		if (ls.length > 0) {
			getLunches(array, done);
		} else {
			done(array);
		}
	}

};

if (process.argv.length > 2 && process.argv[2] == "test") {
	ls = lunchSources.slice();
	getLunches([], function(fields) {
		console.log("\n"+util.inspect(fields, { colors:true }));
	});
	return;
}

try {
	var webhook = require('./secret.json').slack;
} catch (ex) {
	console.error(ex);
	return;
}

var start = function() {
	ls = lunchSources.slice();

	var payload = {
		attachments: [
			{
				fallback: "Dagens lunch",
				fields: []
			}
		]
	};

	getLunches([], function(fields) {

		payload.attachments[0].fields = fields;

		request({
			url: webhook,
			method: 'post',
			json: true,
			body: payload
		});

	});

};

var j = schedule.scheduleJob(rule, start);

// Important stuff

var rule2 = new schedule.RecurrenceRule();
rule2.dayOfWeek = [1, 2, 3, 4, 5];
rule2.hour = 12;
rule2.minute = 0;

var j = schedule.scheduleJob(rule2, function() {
	request({
		url: webhook,
		method: 'post',
		json: true,
		body: {
			text: "<@neme>: Nu börjar lunchen"
		}
	});
});
