# Bamazon

## Application

### Bamazon Customer
bamazonCustomer will give the user an inventory of items to purchase from. The inventory of items will be displayed through a table with properties of item_id, product_name, department_name, price, and stock_quantity. The application will prompt the user to select a product_id, then asks how much of that product the user would like to purchase. It will then return the total cost to the user.

### Bamazon Manager
bamazonManager will bring up the table of inventory items mentioned in bamazonCustomer and give the user a list of actions they may take. 

- - -
1.) View Products for Sale will display the table.

2.) View Low Inventory will display a table with any products with stock_quantity lower than 5. 

3.) Add New Product will ask the user questions to fill in product_name, department_name, price and stock_quantity and add the new product to the database. 

4.) Add Quantity to Existing Item will take user input for the item they want to restock and how much they are re-stocking by and push the change to the database.

5.) Exit Program will exit the manager application.
- - -
## Packages
[cli-table](https://www.npmjs.com/package/cli-table)
[mysql](https://www.npmjs.com/package/mysql)
[inquirer](https://www.npmjs.com/package/inquirer)

## Customer Application Image Rundown

## Manager Application Image Rundown
