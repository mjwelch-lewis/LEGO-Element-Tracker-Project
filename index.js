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
	console.log(request.body);
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

// Update route
app.post("/update", function(request, response){
	Element.findOneAndUpdate({ itemID: request.body.itemID}, {designID: request.body.designID, description: request.body.description, color: request.body.color, colorID: request.body.colorID, quantity: request.body.quantity}, function(err, result) {});
	response.redirect("/read");
})

// Delete route
app.post("/delete", function(request, response){
	const ID = request.body.itemID;
	console.log(ID);
	Element.findOneAndDelete({ itemID: ID}, function(err) {});
	response.redirect("/read");
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

// Edit route
app.post("/edit", function(request, response) {
	Element.findOne({itemID: request.body.itemID}).then(element => { 
		console.log(request.body);
		response.type('text/html');
		response.write(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Update Element</title>
			<link rel="stylesheet" href="style.css">
		</head>
		<body>
			<main>
				<h1>Update Element</h1>
				<form method="post" action="update">
					<div class="form-group">
						<label class="control-label">Item ID</label>
						<input class="form-control" name="itemID" value="${element.itemID}" />
					</div>
					<div class="form-group">
						<label  class="control-label">Design ID</label>
						<input  class="form-control" name="designID" value="${element.designID}"/>
					</div>
					<div class="form-group">
						<label  class="control-label">Description</label>
						<input  class="form-control" name="description" value="${element.description}"/>
					</div>
					<div class="form-group">
						<label class="control-label">Color</label>
						<input class="form-control" name="color" value="${element.color}"/>
					</div>
					<div class="form-group">
						<label class="control-label">Color ID</label>
						<input class="form-control" name="colorID" value="${element.colorID}"/>
					</div>
					<div class="form-group">
						<label class="control-label">Quantity</label>
						<input class="form-control" name="quantity" value="${element.quantity}"/>
					</div>
					<div class="form-group">
						<input type="submit" value="Update" class="button" />
					</div>
				</form>
			</main>
		</body>
		</html>`)
		response.end();
		response.send();
	})
})

// Details route
app.post("/details", function(request, response) {
	Element.findOne({itemID: request.body.itemID}).then(element => { 
		console.log(request.body);
		response.type('text/html');
		response.write(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Element Details</title>
			<link rel="stylesheet" href="style.css">
		</head>
		<body>
			<main>
				<h4>Element Details</h4>
				<hr />
				<dl class="description-horizontal">
					<dt class="description-dark">Item ID:</dt>
					<dd class="description-light" name="itemID">${element.itemID}</dd>
					<dt class="description-dark">Design ID:</dt>
					<dd class="description-light">${element.designID}</dd>
					<dt class="description-dark">Description:</dt>
					<dd class="description-light">${element.description}</dd>
					<dt class="description-dark">Color:</dt>
					<dd class="description-light">${element.color}</dd>
					<dt class="description-dark">Color ID:</dt>
					<dd class="description-light">${element.colorID}</dd>
					<dt class="description-dark">Quantity:</dt>
					<dd class="description-light">${element.quantity}</dd>
					<dt class="description-dark">Image:</dt>
					<dd class="description-light"><img src="https://rondotruck.com/parts/${element.itemID}.jpg" alt=""></dd>
				</dl>
			</main>
		</body>
		</html>`)
		response.end();
		response.send();
	})
})

// Confirm Delete route
app.post("/confirmdelete", function(request, response) {
	Element.findOne({itemID: request.body.itemID}).then(element => { 
		console.log(request.body);
		response.type('text/html');
		response.write(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Element Details</title>
			<link rel="stylesheet" href="style.css">
		</head>
		<body>
			<main>
				<h4>Element Details</h4>
				<hr />
				<dl class="description-horizontal">
					<dt class="description-dark">Item ID:</dt>
					<dd class="description-light">${element.itemID}</dd>
					<dt class="description-dark">Design ID:</dt>
					<dd class="description-light">${element.designID}</dd>
					<dt class="description-dark">Description:</dt>
					<dd class="description-light">${element.description}</dd>
					<dt class="description-dark">Color:</dt>
					<dd class="description-light">${element.color}</dd>
					<dt class="description-dark">Color ID:</dt>
					<dd class="description-light">${element.colorID}</dd>
					<dt class="description-dark">Quantity:</dt>
					<dd class="description-light">${element.quantity}</dd>
					<dt class="description-dark">Image:</dt>
					<dd class="description-light"><img src="https://rondotruck.com/parts/${element.itemID}.jpg" alt=""></dd>
				</dl>
				<form method="post" action="delete">
					<input hidden name="itemID" value="${element.itemID}"/>
            		<input type="submit" formaction="delete" value="Delete" class="button" /> | 
            		<a href="/read">Back to List</a>
        		</form>
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
		text += `
		<tr>
		<td>${element.itemID}</td>
		<td>${element.designID}</td>
		<td>${element.description}</td>
		<td>${element.color}</td>
		<td>${element.colorID}</td>
		<td>${element.quantity}</td>
		<td><img src="https://rondotruck.com/parts/${element.itemID}.jpg" alt=""></td>
		<td>
			<form method="post">
				<input hidden name="itemID" value="${element.itemID}"/>
            	<input type="submit" formaction="edit" value="Edit" class="button" /> | 
            	<input type="submit" formaction="details" value="Details" class="button" /> | 
            	<input type="submit" formaction="confirmdelete" value="Delete" class="button" />
			</form>
        </td>
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
