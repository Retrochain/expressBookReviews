const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    let count = users.filter((user) => user.username === username);
    return count.length === 0;
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter(
        (user) => user.username === username && user.password === password
    );
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            "access",
            { expiresIn: 60 * 60 }
        );
        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res
            .status(208)
            .json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.body.review;
    let username = req.session.authorization.username;
    if (books[isbn]) {
        console.log(books[isbn]);
        books[isbn].reviews[username] = review;
        return res
            .status(200)
            .json({ message: "Review added/updated successfully" });
    }
    return res.status(300).json({ message: "Review not added!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
