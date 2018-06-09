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

// Show menu options
function menuOptions() {
    inquirer
        .prompt({
                name: "BamazonSupervisor",
                type: "list",
                choices: [new inquirer.Separator(), "View Product Sales by Department","Create New Department"]
            })
            .then(function(answer){
                switch (answer.BamazonSupervisor) {
                    case "View Product Sales by Department":
                    salesDept();
                    break;

                    case "Create New Department":
                    newDept();
                    break;
                }
            });
}

// Show sales by department
function salesDept() {
    let query = "SELECT a.department_id AS id,a.department_name AS name,a.over_head_costs AS costs,b.product_sales AS sales,(b.product_sales-a.over_head_costs) AS profits FROM departments a INNER JOIN products b ON (a.department_name = b.department_name) GROUP BY department_id;";
    let values = [];

    connection.query(query, function(err, res){
        if (err) throw err;
        for (var i in res) {
            // Pushing values into an array for console.table
            let tempArr = [];
            tempArr.push(res[i].id);
            tempArr.push(res[i].name);            
            tempArr.push(res[i].costs.toFixed(2));
            tempArr.push(res[i].sales.toFixed(2));
            tempArr.push(res[i].profits.toFixed(2));
            values.push(tempArr);
        }
        // Spacer line
        console.log('');
        // Info in readable table
        console.table(['ID', 'DEPARTMENT', 'OVERHEAD', 'SALES', 'PROFIT'], values);
        // Show menu options
        menuOptions();
    });
}

// Create a new department
function newDept() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "New Department Name: ",
            },
            {
                name: "overhead",
                type: "input",
                message: "Overhead Costs: ",
                validate: function(value) {
                    // Check that price is in correct format
                    if (/(\d+(\.\d{1,2})?)/.test(value) == false) {
                        console.log("\nInvalid cost format. Please re-enter.");
                        return false;
                    }
                    return true;
                }
            }
        ]).then(function(answer) {
            // Add new department to database
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.name,
                    over_head_costs: answer.overhead
                },
                function(err) {
                    if (err) throw err;
                    console.log("Department successfully added.");
                    listDepts();
                }
            );
        });
}

// List departments and stats
function listDepts() {
    let values = [];
    connection.query(
        "SELECT * FROM departments",
        function(err, res) {
            if (err) throw err;
            for (var i in res) {
                // Pushing values into an array for console.table
                let tempArr = [];
                tempArr.push(res[i].department_id);
                tempArr.push(res[i].department_name);            
                tempArr.push(res[i].over_head_costs.toFixed(2));
                values.push(tempArr);
            }
            // Spacer line
            console.log('');
            // Info in readable table
            console.table(['ID', 'DEPARTMENT', 'OVERHEAD'], values);
            // Show menu options
            menuOptions();
        }
    )
}