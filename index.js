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
rule.hour = 10;
rule.minute = 0;

// Sites to scrape for lunches

var lunchSources = [
	{ url: "https://www.matochmat.se/lunch/ostersund", js: "matochmat.js", name: "Mat och mat", includeScripts: true },
	//{ url: "http://lunchguide.nu/?page=ostersund", js: "lunchguide.js", name: "Lunchguide" },
	{ url: "http://www.restaurangtrerum.se/veckans-lunchmeny/", js: "trerum.js", name: "Tre Rum" },
	//{ url: "http://www.hosandreas.se/", js: "hosandreas.js", name: "Hos Andreas" },
	//{ url: "https://www.max.se/sv/Maten/Meny/Maltider/Dagens-Lunch/", js: "max.js", name: "Max" },
	//{ url: "http://example.com", js: "elvans.js", name: "Sibylla" },
	{ url: "https://gist.github.com/madr/ada482c76a33aa6c012d", js: "skamborgen.js", name: "Skamborgen" }
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
			features: current.includeScripts ? {
				FetchExternalResources: ["script"],
				ProcessExternalResources: ["script"],
				SkipExternalResources: false
			} : {},
		  done: function (err, window) {
				if (!err && window) {
					if (window.scrapedField) {
						array.push(window.scrapedField);
					} else if (window.scrapedFields) {
						array = array.concat(window.scrapedFields);
					}
					window.close();
				}
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
	var secrets = require('./secret.json');
} catch (ex) {
	console.error(ex);
	return;
}

var start = function() {
	ls = lunchSources.slice();


	getLunches([], function(fields) {

		if (secrets.slack) {

			var payload = {
				attachments: [
					{
						fallback: "Dagens lunch",
						fields: fields
					}
				]
			};
			request({
				url: secrets.slack,
				method: 'post',
				json: true,
				body: payload
			});	
		}

		if (secrets.teams) {
			var i=1;
			var payload = {
				"@type": "MessageCard",
				"@context": "https://schema.org/extensions",
				"themeColor": "febe36",
				"text": "Dagens lunch",
				"sections": [{
					"facts": fields.map(function(field) {
						var values = field.value.split("\n").map(function(val) { 
							i++; return { "name": " ", "value": val }
						});
						values[0].name = field.title;
						return values;
					}).reduce((acc, val) => acc.concat(val), [])
				}]
			};
			request({
				url: secrets.teams,
				method: 'post',
				json: true,
				body: payload
			});	
		}

	});

};

var j = schedule.scheduleJob(rule, start);

// Important stuff

// var rule2 = new schedule.RecurrenceRule();
// rule2.dayOfWeek = [1, 2, 3, 4, 5];
// rule2.hour = 12;
// rule2.minute = 0;

// var j = schedule.scheduleJob(rule2, function() {
// 	request({
// 		url: webhook,
// 		method: 'post',
// 		json: true,
// 		body: {
// 			text: "<@peder>: Nu börjar lunchen"
// 		}
// 	});
// });

if (process.argv.length > 2 && process.argv[2] == "trigger") {
	start();
}
