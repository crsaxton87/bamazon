DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fancy Toothbrush", "Home Goods", 25.73, 123), ("Calculator", "Office Supplies", 12.99, 620), ("Crush Orange Soda", "Groceries", 2.95, 498), ("1999 Silver Chevy Cavalier", "Auto", 487.00, 2), ("12-Ply Toilet Paper", "Home Goods", 14.67, 22), ("Salty Nut Mix", "Groceries", 12.34, 0), ("Neverhood", "Video Games", 98.00, 35), ("PooPourri", "Home Goods", 6.45, 333), ("Spongebob Squarepants Crop Top", "Apparel", 35.54, 14), ("Adult Diapers", "Medical", 11.11, 207);

SELECT * FROM products