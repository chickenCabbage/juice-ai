var tumblrwks = require("tumblrwks");
var sleep = require("system-sleep");

var tumblr = new tumblrwks({
	consumerKey: "5oZIvD8mfO8S61Pya3sF5a3rmPCypHX6AygHsNRmWDCiurR26B",
	consumerSecret: "aKdV89OvlB1A3mbieZTseOtFoblOXn5wB4E2bZ9SzWT8COPTND",
	accessToken: "sxkprwwPdQZByfNouSjShiAU8HVFbtkaP7Q5knbGdKH9qTh5Cc",
	accessSecret: "Ik3cO1JLda0xsvcnlbDZcrsGj7sXAKXf6dGWJvBrnfGr2an6gq"
}, "juice-ai.tumblr.com");

function postFart() {
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
}

console.log("Starting now.");

var date;
while(true) {
	date = new Date();
	var hour = date.getUTCHours();
	var minute = date.getUTCMinutes();

	//sleep system:

	if(!(hour == 3 && minute >= 30) && hour != 4) sleep(1000 * 60 * 30); //if it's not 3 or 4, wait half an hour
	else { //if it's either past 3 and a half or 4
		if(hour == 3) { //if the hour is past 3 and a half
			sleep(1000 * 60 * 5); //if it's past 3 and a half, wait five minutes
		}
		else { //if the hour is 4
			if(minute == 10) {
				postFart(); //if it's 4:10!
				sleep(1000 * 60 * 60 * 21); //wait 21 hours
			}
			else sleep(1000 * 60 * 0.25); //if it's not 4:10 yet, wait 15 seconds
		}
	}
}