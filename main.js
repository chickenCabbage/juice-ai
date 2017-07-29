var tumblrwks = require("tumblrwks");

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