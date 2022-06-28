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

// Create route called from create.html
app.post("/create", function(request, response){
	let newElement = new Element({
		itemID: request.body.itemID,
		designID: request.body.designID,
		description: request.body.description,
		color: request.body.color,
		colorID: request.body.colorID,
		quantity: request.body.quantity,
		imageURL: `https://rondotruck.com/parts/${request.body.itemID}.jpg`,
	})
	
	newElement.save();
	response.redirect("/");
})

// Read route
app.get("/read", function(request, response) {
	Element.find({}).then(elements => { 
		response.type('text/html');
		response.write(`<!DOCTYPE html>
		<html>
		<head>
			<title>Element Inventory</title>
			<link rel="stylesheet" href="style.css">
		</head>
		<body>
			<main>
				<h1>Your Elements:</h1>
				<table class="table">
					<thead>
						<tr>
							<th>Item ID</th>
							<th>Design ID</th>
							<th>Description</th>
							<th>Color</th>
							<th>Color ID</th>
							<th>Quantity</th>
							<th>Image</th>
						</tr>
					</thead>
					<tbody>
					${renderElements(elements)}
					</tbody>
				</table>
			</main>
		</body>
		</html>`)
		response.end();
		response.send();
	})
})

//Prints the database contents to the user's browser
const renderElements = (elementsArray) => {
	let text = ``;
	elementsArray.forEach((element)=>{
		text += `<tr>
		<td>${element.itemID}</td>
		<td>${element.designID}</td>
		<td>${element.description} 1x1</td>
		<td>${element.color}</td>
		<td>${element.colorID}</td>
		<td>${element.quantity}</td>
		<td><img src="https://rondotruck.com/parts/${element.itemID}.jpg" alt=""></td>
	</tr>`
	})
	
	return text
}

const port = process.env.PORT || 3000
app.get('/test', function(request, response) {
	response.type('text/plain')
	response.send('Node.js and Express running on port='+port)
})

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
})
