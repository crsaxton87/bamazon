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
    // Display menu options
    menuOptions();
});

function menuOptions() {
    inquirer
        .prompt({
                name: "BamazonManager",
                type: "list",
                choices: [new inquirer.Separator(), "View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
            })
            .then(function(answer){
                switch (answer.BamazonManager) {
                    case "View Products for Sale":
                    allProducts();
                    break;

                    case "View Low Inventory":
                    lowInventory();
                    break;

                    case "Add to Inventory":
                    addInventory();
                    break;

                    case "Add New Product":
                    addNew();
                    break;
                }
            });
}

// Function to show complete inventory
function allProducts() {
    let values = [];
    const query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        for (var i in res) {
            // Pushing values into an array for console.table
            let tempArr = [];
            tempArr.push(res[i].item_id);
            tempArr.push(res[i].product_name);
            tempArr.push(res[i].department_name);
            tempArr.push(res[i].price.toFixed(2));
            tempArr.push(res[i].stock_quantity);
            values.push(tempArr);
        }
        // Spacer line
        console.log('');
        // Info in readable table
        console.table(['ID', 'PRODUCT NAME', 'DEPARTMENT', 'PRICE', 'STOCK'], values);
        // Show menu options again
        menuOptions();
    });
}

function lowInventory() {
    let values = [];
    // Find any products with a stock of less than five
    const query = "SELECT * FROM products WHERE stock_quantity<5";
    connection.query(query, function(err, res){
        for (var i in res) {
            // Pushing values into an array for console.table
            let tempArr = [];
            tempArr.push(res[i].item_id);
            tempArr.push(res[i].product_name);
            tempArr.push(res[i].department_name);
            tempArr.push(res[i].price.toFixed(2));
            tempArr.push(res[i].stock_quantity);
            values.push(tempArr);
        }
        // Spacer line
        console.log('');
        // Info in readable table
        console.table(['ID', 'PRODUCT NAME', 'DEPARTMENT', 'PRICE', 'STOCK'], values);
        // Show menu options again
        menuOptions();
    });
}

function addInventory() {
    let values = [];
    const query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        for (var i in res) {
            // Pushing values into an array for console.table
            let tempArr = [];
            tempArr.push(res[i].item_id);
            tempArr.push(res[i].product_name);
            tempArr.push(res[i].department_name);
            tempArr.push(res[i].price.toFixed(2));
            tempArr.push(res[i].stock_quantity);
            values.push(tempArr);
        }
        // Spacer line
        console.log('');
        // Info in readable table
        console.table(['ID', 'PRODUCT NAME', 'DEPARTMENT', 'PRICE', 'STOCK'], values);

        // Ask which item manager would like to add more of
        inquirer
            .prompt(
                {
                    name: "item",
                    type: "input",
                    message: "Which item would you like to add more of? (ID)",
                    validate: function(x) {
                        // Confirm that user input is a number
                        if (isNaN(x) || x < 1) {
                            console.log("\nInput not valid. Make another selection");
                            return false;
                        }
                        return true;
                    }
                }
            ).then(function(answer){
                connection.query(
                    // Select products matching user input
                    "SELECT * FROM products WHERE ?",
                    {item_id: answer.item},
                    function(err, res) {
                        // Check if item exists
                        if (err) {
                            console.log('\nInvalid selection. Please select a new item.\n');
                            addInventory();
                        } else {
                            // Store item id in variable
                            let item = answer.item;
                            // Ask user how many to add
                            inquirer
                                .prompt(
                                    {
                                        name: "quantity",
                                        type: "input",
                                        message: "How many would you like to add?",
                                        validate: function(x) {
                                            // Confirm that user input is a number
                                            if (isNaN(x) || x < 1) {
                                                console.log("\nInput not valid. Make another selection");
                                                return false;
                                            }
                                            return true;
                                        }
                                    }
                                ).then(function(answer) {
                                    // Update quantity
                                    connection.query(
                                        `UPDATE products SET stock_quantity = stock_quantity + ${parseInt(answer.quantity)} WHERE ?`,
                                        [
                                            {
                                                item_id: item
                                            }
                                        ],
                                        function(err) {
                                            if (err) throw err;
                                            console.log("\nQuantity successfully updated.");
                                            // Show updated product
                                            updatedProduct(item);
                                        }
                                    );
                                });
                        }
                    });
            });
    });    
}

// Show updated product
function updatedProduct(item) {
    let values = [];
    // Find any products with a matching item id
    const query = "SELECT * FROM products WHERE item_id="+item;
    connection.query(query, function(err, res){
        for (var i in res) {
            // Pushing values into an array for console.table
            let tempArr = [];
            tempArr.push(res[i].item_id);
            tempArr.push(res[i].product_name);
            tempArr.push(res[i].department_name);
            tempArr.push(res[i].price.toFixed(2));
            tempArr.push(res[i].stock_quantity);
            values.push(tempArr);
        }
        // Spacer line
        console.log('');
        // Info in readable table
        console.table(['ID', 'PRODUCT NAME', 'DEPARTMENT', 'PRICE', 'STOCK'], values);
        // Show menu options again
        menuOptions();
    });
}

// Add new product
function addNew() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "New Product Name: "
            },
            {
                name: "department",
                type: "input",
                message: "Department: "
            },
            {
                name: "price",
                type: "input",
                message: "Price: ",
                validate: function(value) {
                    // Check that price is in correct format
                    if (/(\d+\.\d{1,2})/.test(value) == false) {
                        return false;
                        console.log("\nInvalid price format. Please re-enter.");
                    }
                    return true;
                }
            },
            {
                name: "stock",
                type: "input",
                message: "Quantity in Stock: ",
                validate: function(x) {
                    // Confirm that user input is a number
                    if (isNaN(x) || x < 1) {
                        console.log("\nInput not valid. Please re-enter.");
                        return false;
                    }
                    return true;
                }
            }
        ]).then(function(answer) {
            // Add product to database
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.name,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function(err) {
                    if (err) throw err;
                    console.log("Product added successfully.");
                    allProducts();
                }
            );
        });
}