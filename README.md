# OrganicStore-NodeJS
A E-Commerce website in Node JS in which <b>User</b> can buy Products and <b>Seller</b> can Sell products. It will be overlooked by <b>Admin or Root</b>. 

```
npm start or node app.js
```
It will run under the url http://127.0.0.1:3000/

Email and Password for Online Website:<br>
Customer:<br>
Email Id: user@gmail.com<br>
Password: user<br>

Seller   :<br>
Email    :tata@gmail.com<br>
Password: tata<br>

Pre-requisites
--------------
- Node JS (Tested on v12.14.0)
- Mongoose
- Pre-requisites or Dependencies(Below)

Role
------
- Admin or Root
  - See all Product and Remove Product
  - See all Users(Seller or Customer) and Remove them
- Seller
  - Ability to add New Product
  - Common Features (Change Password etc.)
- Customer
  - See all Product available from Seller
  - Ability to add Product in Cart
  - Ability to order Product

Schema
------
<h4><b>Products Schema</b></h4>

| Name  | Type | Required | Unique | Encrpyted|
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Name  | String  | Yes | No | No |
| Email  | String  | Yes | Yes | No |
| Gender | String | Yes | No | No |
| Password | String | Yes | No | Yes |
| DOB | String | Yes | No | No |
| Phone No. | String | Yes | No | No |
| Address 1 | String | Yes | No | No |
| Address 2 | String | Yes | No | No |
| City | String | Yes | No | No |
| State | String | Yes | No | No |
| ZipCode | String | Yes | No | No |
| Type(Role) | String | Yes | No | No |
| TotalInCart | Number | No | No | No |
| Cart | Array of Object | No | No | No |
| Ordered | Array of Object | No | No | No |

<h4><b>Users Schema</b></h4>

| Name  | Type | Required  | Encrpyted|
| ------------- | ------------- | ------------- | ------------- |
| Category  | String  | Yes | No |
| Name  | String  | Yes | No |
| Price  | String  | Yes | No |
| Img location  | String  | Yes | No |
| Seller Company  | String  | Yes | No |


<h5><b>Cart Object</b></h5>

```bash
|__ Cart
|   |----- ProductData
|   |      |---Type -> ObjectId
|   |      |---Ref  -> Products
|   |
|   |------ Date
|   |       |---Type -> String
|   |
|   |------ Quanitiy
|   |       |---Type -> Number
```

<h5><b>Ordered Object</b></h5>

```bash
|__ Ordered
|   |----- ProductData
|   |      |---Type -> ObjectId
|   |      |---Ref  -> Products
|   |
|   |------ Date
|   |       |---Type -> String
|   |
|   |------ Quanitiy
|   |       |---Type -> Number
```

Dependencies
------------
- Express
```
npm install express
```
- EJS-Mate
```
npm install ejs-mate
```
- Path
```
npm install path
```
- Serve Favicon
```
npm install serve-favicon
```
- Connect Mongo
```
npm install connect-mongo
```
- Express-Session
```
npm install express-session
```
- Express-Flash
```
npm install express-flash
```
- Multer
````
npm install multer
````
- Morgan
```
npm install morgan
```
- Mongoose
```
npm install mongoose
```
- Body Parser
```
npm install body-parser
```
- Dotenv
```
npm install dotenv
```
- Bcrpty
```
npm install bcrpty
```
- Date Format
```
npm install dateformat
```
Directory
----------

```bash
|___ Root
|   |--- app.js
|   |
|   |--- Controller
|   |    |--- index.js
|   |    |--- product.js
|   |    |--- userproduct.js
|   |    |--- users.js
|   |
|   |--- Dump (Mongoose Dump) (Dump)
|   |
|   |--- Middleware
|   |    |--- middleware.js
|   |
|   |--- Models
|   |    |--- db connect
|   |    |--- product.js
|   |    |--- Users.js
|   |
|   |--- Public
|   |    |--- css (Static)
|   |    |--- img (Staic and Dynamic)
|   |    |--- js (Static)
|   |
|   |--- Routes
|   |    |--- Product.js
|   |    |--- Users.js
|   |--- services
|   |    |--- index.js
|   |    |--- product.js
|   |    |--- seller.js
|   |    |--- tabledata.js
|   |    |--- user.js
|   |    |--- userproduct.js
|   |--- viwes
|   |    |--- paritials
|   |    |    |--- footbar.ejs
|   |    |    |--- navbar.ejs
|   |    |--- addproductpage.ejs
|   |    |--- adminpage.ejs
|   |    |--- adminpageProduct.ejs
|   |    |--- adminpageUser.ejs
|   |    |--- cartpage.ejs
|   |    |--- changepasswordpage.ejs
|   |    |--- home.ejs
|   |    |--- login.ejs
|   |    |--- orderedpage.ejs
|   |    |--- profile.ejs
|   |    |--- register.ejs
|   |    |--- sellerpage.ejs
```
