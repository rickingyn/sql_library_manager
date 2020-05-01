const express = require('express');
const router = express();
const Book = require('../models').Book;

// Handler function to wrap each route
function asyncHandler(cb) {
    return async( req, res, next ) => {
        try {
            await cb( req, res, next )
        } catch(error) {
            res.status(500).send(error);
        }
    }
}

// route to show full list of books
router.get('/', asyncHandler( async( req, res ) => {
    // use sequelize's findAll method to return all books and pass to index template
    const books = await Book.findAll({
        order: [['title', 'ASC']]
    });
    res.render('index', { books, title: 'Books' });
}));

// route to create book form
router.get('/new', ( req, res ) => {
    res.render('new-book', { title: 'New Book' });
}); 

// route to post a new book to the database
router.post('/', asyncHandler( async( req, res ) => {
    // pass book object from form into variable
    const newBook = req.body;
    let book;

    // try - create new book
        // catch - render form with error message if there is a validation error
    try {
        book = await Book.create(newBook);
        res.redirect(`/books`);
    } catch(error) {
        if(error.name === "SequelizeValidationError") {
            book = await Book.build(newBook);
            res.render('new-book', { book, errors: error.errors });
        } else {
            throw error;
        }
    }
}));

// route to show book detail 
router.get('/:id', asyncHandler( async( req, res ) => {
    // find book with id in URL and pass to template
        // render update book template if there is a book with the id in the URL
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    
    if(book) {
        res.render('update-book', { book, title: book.title });
    } else {
        res.sendStatus(404);
    }
}));

// route to update book
router.post('/:id', asyncHandler( async( req, res ) => {
    // save book id and form values to variables
    const bookId = req.params.id;
    const updatedBook = req.body;
    let book;

    // try - updating book with value from from
        // catch - show error message if there is a validation error
    try {
        book = await Book.findByPk(bookId);
        // if book exists, update book and redirect to home page
        if(book) {
            await book.update(updatedBook);
            res.redirect('/books');
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        if(error.name === "SequelizeValidationError") {
            book = await Book.build(updatedBook);
            res.render('update-book', { book, errors: error.errors });
        } else {
            throw error;
        }
    }
}));


// route to delete book
router.post('/:id/delete', asyncHandler( async( req, res ) => {
    // find book using ID from URL
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);

    // if book exists, then delete 
    if(book) {
        await book.destroy();
        res.redirect('/books');
    } else {
        res.sendStatus(404);
    }
}));

module.exports = router;
