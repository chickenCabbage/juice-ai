console.log("Starting JUICE-AI...");
var args = process.argv.slice(2);
if(args[0] == "-t") { //test parameters
	console.warn("Script works well.");
	process.exit(0); //you're okay
}
else if(args[0]) { //if you have args but they're not as expected
	console.warn("Invalid parameters, executing normally.");
}

var sleep = require("system-sleep"); //for timing to help with the CPU load

var fs = require("fs"); //for reading files

var tumblrwks = require("tumblrwks"); //timblr API, simplified (and working!)
var creds = JSON.parse(fs.readFileSync("./creds.json").toString()); //parse tokens from file
console.log("Parsed login credentials.");
var tumblr = new tumblrwks({
	consumerKey: creds.consumerKey,
	consumerSecret: creds.consumerSecret,
	accessToken: creds.accessToken,
	accessSecret: creds.accessSecret
}, "juice-ai.tumblr.com");

var http = require("http"); //for page serving
var port = process.env.PORT || 8080; //process.env.PORT is the port assigned by the Heroku dyno

http.createServer(function(request, response) { //serve the stuff
	switch(request.url) {
		case "/favicon.ico":
			var icon = fs.readFileSync("./favicon.ico");
			response.writeHead(200, {"content-type" : "image/x-icon"});
			response.end(icon);
		break;
		case "/simple": //plaintext
			response.writeHead(200, {"content-type" : "text/plain"});
			response.end(howLong());
		break;

		case "/keepAlive": //to prevent Heroku's dynos from sleeping
			//used to distinguish real people from keepAlive()
			response.writeHead(200, {"content-type" : "text/plain"});
			response.end("Still awake.");
		break;

		default:
			var content = fs.readFileSync("./index.html").toString();
			content = content.replace("An error has occured.", howLong());
			response.writeHead(200, {"content-type" : "text/html"});
			response.end(content);
		break;
	}
}).listen(port);
console.log("HTTP server created and listening.");

function postFart() { //posts to tumblr
	console.log("posting to Tumblr now...");
	tumblr.post("/post",
		{
			type: "text", //the type
			title: "fart", //the title
			body: "", //nothing, leaving this for future reference
			tags: "17776,17776 football,17776 juice,this post is from an automated bot"
		},
		function(err, json) {
			var date = new Date()
			console.log("farted successfully, " + date.getUTCDate() + "/" + (date.getUTCMonth() + 1));
		}
	);
} //end postFart()

function howLong() { //calculates the time until 4:10.
	var now = new Date();
	var end; //the next 4:10

	//if it hasn't been 4:10 today yet
	if(now.getUTCHours() <= 4) {
		if(now.getUTCMinutes() < 10) end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 4, 10);
		else if(now.getUTCMinutes() == 10) return "Now!"; //woo
		else end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 4, 10);
		//if it's stil 4AM but past 4:10
	}
	else end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 4, 10); //if it's past 4:10

	var minutes = parseInt((end.getTime() - now.getTime()) / (1000 * 60)); //how long, in minutes
	var hours = 0;
	//convert it into hours and minutes rather than just minutes:
	while(minutes > 60) {
		hours ++;
		minutes = minutes - 60;
	}
	return hours + " hours, " + minutes + " minutes to 4:10 UTC.";
} //end howLong()

function keepAlive() {
	var options = { //JSON config
		host: "juice-ai.herokuapp.com",
		path: "/keepAlive"
	};
	http.request(options).end();
} //end keepAlive()

async function timer() {
	console.log("Timer has started.");
	var date;
	while(true) {
		date = new Date();
		var hour = date.getUTCHours();
		var minute = date.getUTCMinutes();

		//sleep system:

		if(!(hour == 3 && minute >= 30) && hour != 4) {
			keepAlive();
			sleep(1000 * 60 * 25); //if it's not 3 or 4, wait 25 minutes
		}
		else { //if it's either past 3 and a half or 4
			if(hour == 3) { //if the hour is past 3 and a half
				keepAlive();
				sleep(1000 * 60 * 5); //if it's past 3 and a half, wait five minutes
			}
			else { //if the hour is 4
				if(minute == 10) {
					postFart(); //if it's 4:10!
					keepAlive();
					sleep(1000 * 60 * 25); //wait 25 minutes
				}
				else if(minute < 10) {
					sleep(1000 * 60 * 0.25); //if it's not 4:10 yet, wait 15 seconds
				}
				else {
					keepAlive();
					sleep(1000 * 60 * 25); //if it's still 4 but past 4:10, sleep 25 minutes
				}
			}
		}
	}
	//waiting 25 minutes to prevent heroku dyno sleep
} //end timer()

timer();