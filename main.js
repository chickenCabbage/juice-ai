var tumblrwks = require("tumblrwks");
var sleep = require("system-sleep");
var http = require("http");
var fs = require("fs");

var port = process.env.PORT || 8080;

var tumblr = new tumblrwks({
	consumerKey: "5oZIvD8mfO8S61Pya3sF5a3rmPCypHX6AygHsNRmWDCiurR26B",
	consumerSecret: "aKdV89OvlB1A3mbieZTseOtFoblOXn5wB4E2bZ9SzWT8COPTND",
	accessToken: "sxkprwwPdQZByfNouSjShiAU8HVFbtkaP7Q5knbGdKH9qTh5Cc",
	accessSecret: "Ik3cO1JLda0xsvcnlbDZcrsGj7sXAKXf6dGWJvBrnfGr2an6gq"
}, "juice-ai.tumblr.com");

var args = process.argv.slice(2);
if(args[0] == "-t") {
	console.log("Script works well.");
	process.exit(0); //you're okay
}
else if(args[0]){ //if you have args but they're not as expected
	console.log("Invalid parameters, executing normally.");
}

function postFart() { //posts to tumblr
	console.log(new Date());
	tumblr.post("/post",
		{
			type: "text", //the type
			title: "fart", //the title
			body: "", //nothing, leaving this for future reference
			tags: "17776,17776 football,17776 juice,this post is from an automated bot"
		},
		function(err, json){
			if(err) throw err; //oy
			console.log("fart\n");
		}
	);
} //end postFart()

function howLong() { //calculates the time until 4:10
	var now = new Date();
	var end;
	if(now.getUTCHours() <= 4) {
		if(now.getUTCMinutes() < 10) end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 4, 10);
		//it hasn't been 4:10 today yet
		else if(now.getUTCMinutes() == 10) return "Now!";
		else end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 4, 10);
		//if it's 4 but past 10
	}
	else end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 4, 10); //if it's past 4:10
	return parseInt((end.getTime() - now.getTime()) / (1000 * 60)) + " minutes until 4:10 UTC.";
} //end howLong()

function queryHeroku() {
	var options = {
		host: "juice-ai.herokuapp.com",
		path: "/"
	};
	http.request(options).end();
}

http.createServer(function(request, response) { //serve the text
	if(request.url == "/favicon.ico") {
		response.end("No favicon.");
	}
	else {
		response.end(howLong());
	}
}).listen(port, function(err) {
	if(err) {
		console.log("ERROR! " + err);
	}
});

console.log("Starting now.");

var date;
while(true) {
	date = new Date();
	var hour = date.getUTCHours();
	var minute = date.getUTCMinutes();

	//sleep system:

	if(!(hour == 3 && minute >= 30) && hour != 4) {
		console.log("sleeping 20 minutes");
		queryHeroku();
		sleep(1000 * 60 * 20); //if it's not 3 or 4, wait 14 minutes
	}
	else { //if it's either past 3 and a half or 4
		if(hour == 3) { //if the hour is past 3 and a half
			console.log("sleeping 5 minutes");
			queryHeroku();
			sleep(1000 * 60 * 5); //if it's past 3 and a half, wait five minutes
		}
		else { //if the hour is 4
			if(minute == 10) {
				postFart(); //if it's 4:10!
				console.log("sleeping 20 minutes");
				queryHeroku();
				sleep(1000 * 60 * 20); //wait 14 minutes
			}
			else {
				sleep(1000 * 60 * 0.25); //if it's not 4:10 yet, wait 15 seconds
			}
		}
	}
}

//waiting 20 minutes to prevent heroku dyno sleep