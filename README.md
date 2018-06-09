# Bamazon Storefront (Node.js & MySQL)

## Overview

This app is an Amazon-like storefront demonstrating basic Node.js and MySQL functionality.

## bamazonCustomer.js

The customer interface allows the user to see the items in stock (by product id, name, and price) and make purchases, as shown in the image below.

*[Bamazon Customer Inferface](./images/01customer.png)

## bamazonManager.js

The manager interface allows users to:

1. View all products for sale, including ID, name, department, price, and quantity in stock.
2. View products with low inventory (quantity in stock  < 5)
    *[Bamazon Manager - View Products for Sale & Low Inventory](./images/02manager-view.png)
3. Add quantity to existing products
    *[Bamazon Manager - Add Quantity](./images/03manager-add.png)
4. Add a new product
    *[Bamazon Manager - Add Products](./images/04manager-new.png)

## bamazonSupervisor.js

The supervisor interface allows users to:

1. View product sales by department, including departmental overhead costs, total sales, and total profit.
    *[Bamazon Supervisor - View Sales](./images/05supervisor-list.png)
2. Add a new department
    *[Bamazon Supervisor - Add Department](./images/06supervisor-new.png)
    

