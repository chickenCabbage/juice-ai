/*

    ▄▄▄▄▄ ▄   ▄█ ▄█▄    ▄███▄       ██   ▄█
  ▄▀  █    █  ██ █▀ ▀▄  █▀   ▀      █ █  ██
      █ █   █ ██ █   ▀  ██▄▄        █▄▄█ ██
     █  █   █ ▐█ █▄  ▄▀ █▄   ▄▀     █  █ ▐█
   ▄ █  █▄ ▄█  ▐ ▀███▀  ▀███▀          █  ▐
    ▀    ▀▀▀                          █

 * Made by Alon Shiboleth
 * 17776/20020 by Jon Bois
 * github.com/chickenCabbage/juice-ai

 */

var sleep = require("system-sleep"); //for timing to help with the CPU load
require("dotenv").config({path: "../juice-env.env"}); //environment vars
var fs = require("fs"); //for reading files

var tumblrjs = require("tumblr.js"); //tumblr API
const tumblr = tumblrjs.createClient({
	credentials: {
	  consumer_key: process.env.CONSUMER_KEY,
	  consumer_secret: process.env.CONSUMER_SECRET,
	  token: process.env.ACCESS_TOKEN,
	  token_secret: process.env.ACCESS_SECRET
	}
});

var http = require("http"); //for page serving
var port = process.env.PORT || 8888; //process.env.PORT is the port assigned by the Heroku dyno

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
			console.log("Kept alive.");
		break;

		case "/test": //plaintext
			if(!request.headers.authorization) {
				response.setHeader('WWW-Authenticate', 'Basic');
				response.writeHead(401, {"content-type" : "text/plain"});
				response.end("No auth headers.");
			}
			else {
				var auth = new Buffer.from(request.headers.authorization.split(' ')[1], 'base64').toString().split(':')
				if((auth[0] == process.env.CONSUMER_KEY) && (auth[1] == process.env.CONSUMER_SECRET)) {
					response.setHeader('WWW-Authenticate', 'Basic');
					response.writeHead(200, {"content-type" : "text/plain"});
					postFart();
					response.end("Posted fart.");
				}
				else {
					response.setHeader('WWW-Authenticate', 'Basic');
					response.writeHead(403, {"content-type" : "text/plain"});
					response.end("Authentication does not match.");
				}
			}
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
	tumblr.createTextPost("juice-ai.tumblr.com", {
		title: "fart",
		body: "",
		tags: "17776, 17776 football, 17776 juice, this post is from an automated bot"
	}, function(err, res, body) {
		var date = new Date();
		console.log("Fart attempt made, " + date.getUTCDate() + "/" + (date.getUTCMonth() + 1));
		if(err) console.log(err.toString());
	});
} //end postFart()

function howLong() { //calculates the time until 4:10.
	var now = new Date();
	now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes());
	var end; //the next 4:10

	//if it hasn't been 4:10 today yet
	if(now.getUTCHours() < 4 || (now.getUTCHours() == 4 && now.getUTCMinutes() <= 10)) {
		if(now.getUTCHours() == 4 && now.getUTCMinutes() == 10) return "Now!"; //woo
		else end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 4, 10);
	}
	else { //if you've past today's 4:10, next one is tomorrow. when is tomorrow?
		var days;
		switch(now.getUTCMonth()) {
			case 0:
			case 2:
			case 4:
			case 6:
			case 7:
			case 9:
			case 11:
				days = 31; //31-day month
				if(now.getUTCDate() == days) {
					if(now.getUTCMonth() == 11) end = new Date(now.getUTCFullYear() + 1, 0, 1, 4, 10); //tomorrow is jan 1
					else end = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 4, 10); //tomorrow is next month
				}
				else end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 4, 10); 
				break;
			case 3:
			case 5:
			case 8:
			case 10:
				days = 30; //30-day month
				if(now.getUTCDate() == days)
					end = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 4, 10); //tomorrow is next month
				else end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 4, 10); 
				break;
			case 1:
				//check if leap year, february has 29 days:
				var y = now.getUTCFullYear();
				if(y % 4 != 0) days = 28;
				else if(y % 100 != 0) days = 29;
				else if(y % 400 != 0) days = 28;
				else days = 29;
				//fuck february
				if(now.getUTCDate() == days)
					end = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 4, 10); //tomorrow is next month
				else end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 4, 10); 
				break;
			default:
				end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 4, 10);
				break;
		}
	}

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
		host: "juice-ai-redux.herokuapp.com",
		path: "/keepAlive"
	};
	http.request(options).end();
} //end keepAlive()

var counter = 0;
setInterval(function() {
	date = new Date();
	var hour = date.getUTCHours();
	var minute = date.getUTCMinutes();
	if(minute == 10 && hour == 4) postFart(); //if it's 4:10!
	if(counter >= 20) {
		keepAlive();
		counter = 0;
	}
	counter++;
}, 59*1000); //sleep 59 seconds