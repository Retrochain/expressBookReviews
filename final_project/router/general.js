const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    return res.status(200).send(books[req.params.isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let author = req.params.author;
    let filteredBooks = Object.values(books).filter(
        (book) => book.author === author
    );
    if (filteredBooks.length > 0)
        return res.status(200).send(JSON.stringify(filteredBooks));
    return res.status(300).json({ message: "Not found!" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let title = req.params.title;
    let filteredBooks = Object.values(books).filter(
        (book) => book.title === title
    );
    if (filteredBooks.length > 0)
        return res.status(200).send(JSON.stringify(filteredBooks));
    return res.status(300).json({ message: "Not found!" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    return res.status(200).send(JSON.stringify(books[req.params.isbn].reviews));
});

// Async getting all books
public_users.get("/async/books", async function (req, res) {
    try {
        const response = await axios.get("http://localhost:5000/");
        return res.status(200).json(response.data);
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error fetching book list", error: error.message });
    }
});

// Async getting books by isbn
public_users.get("/async/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

        return res.status(200).send(JSON.stringify(response.data, null, 2));
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching book details",
            error: error.message,
        });
    }
});

//Async getting books by author
public_users.get("/async/:author", async (req, res) => {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);

        return res.status(200).send(JSON.stringify(response.data, null, 2));
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching book details",
            error: error.message,
        });
    }
});

// Async getting books by title
public_users.get("/async/:title", async (req, res) => {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);

        return res.status(200).send(JSON.stringify(response.data, null, 2));
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching book details",
            error: error.message,
        });
    }
});

module.exports.general = public_users;
