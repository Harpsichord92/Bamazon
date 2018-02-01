// NPM packages
var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');
var count = 0;
var columns = ['item_id', 'product_name','department_name','price','stock_quantity'];

	// Establish connection
	var connection = mysql.createConnection({
		host		:'localHost',
		user		:'root',
		password	:'root',
		port		:'8889',
		database  	:'bamazon'
	});

// Check to see if connection is successful
connection.connect(function(err){
	if(err) throw err;
	console.log('connectin id' , connection.threadId);
	displayTable();
});
// Query Data
function displayTable() {
	
	var query = 'SELECT * FROM products';
		connection.query(query,function(err,res,fields) {
			if(err) throw err;

			// Testing
			var table = new Table({
			    head: ['item_id', 'product_name','department_name','price','stock_quantity'], 
			    colWidths: [25, 25, 25 ,25 ,25]
			});

			for(var i = 0; i< res.length; i++) {
				// Creates a new array
				var newArray = new Array();

				// Adds content to table
				table.push(newArray);

				// Adds content to new array of Nth row
				for(var j = 0; j < columns.length; j++){
					newArray.push(res[i][columns[j]]);
				}
			}

			// Displays Table in terminal
			console.log(table.toString());
			customerRequest();
		});
}

function displayLowTable() {
	var lowCount = 5;
	var query = 'SELECT * FROM products WHERE stock_quantity <' + lowCount;
		connection.query(query,function(err,res,fields) {
				if(err) throw err;

				// Testing
				var table = new Table({
				    head: ['item_id', 'product_name','department_name','price','stock_quantity'], 
				    colWidths: [25, 25, 25 ,25 ,25]
				});

				// Console.log(res[0].stock_quantity);
				for(var i = 0; i< res.length; i++) {

					// Creates a new array
					var newArray = new Array();

					// Adds content to table
					table.push(newArray);
					// Adds content to new array of Nth row
					for(var j = 0; j < columns.length; j++){
						newArray.push(res[i][columns[j]]);
					}
				}

				//Displays Table in terminal
				console.log(table.toString());
				customerRequest();
			});
}

function customerRequest() {
	// Ask customer for id input
	inquirer.prompt([	
		{ 
			type:'rawlist',
			name: 'choice',
			message: 'What would you like to do?',
			choices:['View Products for Sale','View Low Inventory','Add New Product', 'Add Quantity to Existing Item', 'Exit Program']
		}
	])
	.then(function(answer) {
		switch(answer.choice) {
			case 'View Products for Sale' :
				displayTable();
				break;
			case 'View Low Inventory' :
				displayLowTable();
				break;
			case 'Add New Product' : 
				addNewProduct()
				break; 
			case 'Add Quantity to Existing Item' :
				updateItem();
				break;
			case 'Exit Program' :
				connection.end();
				break;
		}
	});
}

function updateItem() {
	inquirer.prompt([
			{
				type:'input',
				name:'product',
				message:'What is the name of the product'
			}
		]).then(function(answer){
		var query = 'SELECT product_name FROM products';
		var product = answer.product;
			connection.query(query,function(err,res,fields){
				if(err) throw err;

				// Checks if product_name is valid
				for(var i = 0; i <res.length;i++) {

					if(res[i].product_name === answer.product){

						// Testing Show products name
						count++;
					}
				}
				// If item exist.....
				if(count > 0) {

					// Reset counter
					count = 0;

					// Ask for quantity user would like to add
					inquirer.prompt([
						{
							type: 'input',
							name: 'quantity',
							message: 'How many would you like to add?'		
						}

					]).then(function(answer) {

						// Get stock quantity from product that was choosen
						var query = 'SELECT * FROM products WHERE ?'; 
						var stockQty = 0;
						var quantity = parseInt(answer.quantity);
						connection.query(query,[
							{
								product_name: product
							}
						], function(err,res,fields) {
							stockQty = parseInt(res[0].stock_quantity);

							// Update database 
							console.log('Stock Quantity: ' , stockQty);
							console.log('Quantity: ' , quantity);
							console.log('Stock Quantity: ' , product);
							var query ='UPDATE products SET ? WHERE ?'
							connection.query(query,[
								{
									stock_quantity: stockQty + quantity
								},
								{
									product_name: product
								}
							],function(err,res,fields) {
								if(err) throw err;
								console.log("Quantity added!");
								displayTable();
							});
						}); 
					});
				}
				else {
					console.log("That item does not exist");
					// Ask for the name of product again
					updateItem();
				}
			});
	});
}

function addNewProduct() {
	inquirer.prompt([
		{
			type:'input',
			name:'product',
			message:'What is the product name?'
		},
		{
			type:'input',
			name:'department',
			message:'What is the department name?'
		},
		{
			type:'input',
			name:'price',
			message:'How much does it cost?'
		},
		{
			type:'input',
			name:'stockQty',
			message:'How many do you want to add?'
		}
	]).then(function(answer){
		var product = answer.product;
		var department = answer.department;
		var price = answer.price;
		var stockQty = answer.stockQty;
		var post = {
					product_name: product,
					department_name: department ,
					price: price,
					stock_quantity:stockQty
				   }
		var query = 'INSERT INTO products SET ?';
		connection.query(query,post,function(err,res,field) {
			displayTable();
		});
	});

}
