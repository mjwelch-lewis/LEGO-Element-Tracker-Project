const express = require("express");
const app = express();

app.use(express.static(__dirname + '/client'))

// Start MongoDB Atlas ********
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//Username: LEGOElementTrackerUser
//password: PvIXVCzIOUZMUJ8x
const mongoose = require("mongoose");
const mongooseUri = "mongodb+srv://LEGOElementTrackerUser:PvIXVCzIOUZMUJ8x@elementdatabase.gyyim.mongodb.net/elementDatabase"

mongoose.connect(mongooseUri, {useNewUrlParser: true}, {useUnifiedTopology: true})

const elementSchema = {
	itemID: String,
	designID: String,
	description: String,
	color: String,
	colorID: String,
	quantity: Number,
	imageURL: String,
}

const Element = mongoose.model("element", elementSchema);

const port = process.env.PORT || 3000
app.get('/test', function(request, response) {
	response.type('text/plain')
	response.send('Node.js and Express running on port='+port)
})

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
})
