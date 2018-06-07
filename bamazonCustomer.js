// NPM Packages
require ('dotenv').config()
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

// Connection to MySQL server
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: process.env.password,
    database: "bamazon"
});

// After connection
connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected to server');
    // Display Products
    displayProducts();
});

// Function to display products
function displayProducts() {
    let values = [];
    const query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        for (var i in res) {
            let tempArr = [];
            tempArr.push(res[i].item_id);
            tempArr.push(res[i].product_name);
            tempArr.push(res[i].price);
            values.push(tempArr);
        }
        console.table(['ID', 'PRODUCT NAME', 'PRICE'], values);
        userQuestions();
    });
}

function userQuestions() {
    inquirer
    .prompt([
        {
            name: "id",
            type: "input",
            message: "What is the ID of the product you would like to purchase?",
            validate: function(x) {
                // Confirm that user input is a number
                if (isNaN(x) || x < 1 || x > 10) {
                    console.log("\nInput not valid. Make another selection");
                    return false;
                }
                return true;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units would you like to purchase?",
            validate: function(x) {
                // Confirm that user input is a number
                if (isNaN(x) || x < 1 || x > 10) {
                    console.log("\nInput not valid. Make another selection");
                    return false;
                }
                return true;
            }
        }
    ])
    .then(function(answer){
        // Store user inputs in variables
        let id = answer.id;
        let quantity = answer.quantity;
        console.log(id, quantity);
        // Find product in database by ID
        connection.query(
            "SELECT * FROM products WHERE ?",
            [
                {
                    item_id: id
                }
            ],
            function(err, res) {
                if (err) throw err;
                let stock = res[0].stock_quantity;
                let price = res[0].price;
                // If there isn't enough stock to fulfill order
                if (quantity > stock) {
                    console.log("Insufficient quantity in stock. Please make another selection");
                    userQuestions();
                }
                else {
                    // If purchase successful, update quantity
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: stock - quantity
                            },
                            {
                                item_id: id 
                            }
                        ],
                        function(err) {
                            if (err) throw err;
                            console.log(`\nPurchase successful! Order total: $${price * quantity}\n`);
                            displayProducts();
                        }
                    );
                }
            }
        );
    });
}