# Tech Blog
## Description
Tech Blog is a blogging platform for technology enthusiasts. You can sign up, create blog posts, and leave comments on other users' posts. The platform is built using Node.js, Express.js, and MySQL for the backend, and Handlebars.js for the frontend.

# Installation
Clone the repository to your local machine.
Run `npm install` to install the dependencies.
Create a .env file in the root directory with your MySQL database connection details, like this:
`DATABASE=techblogdb
USERNAME=root
PASSWORD=yourpassword`
Run the following commands to create and seed the database:
`mysql -u root -p`
`create database techblogdb;`
`quit`
`npm run start`
* Please only seed the application after you've run it for the first time and made a profile.
`npm run seed`
# Usage
You can sign up for an account, create blog posts, and leave comments on other users' posts. The homepage displays all the blog posts, and you can click on a post to view the full post and its comments. You can also edit or delete your own posts.
