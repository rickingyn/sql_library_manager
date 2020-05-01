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
    res.render('index', { books });
}));

// route to create book form
router.get('/new', ( req, res ) => {
    res.render('new-book');
}); 

// route to post a new book to the database
router.post('/', asyncHandler( async( req, res ) => {
    // pass book object from form into variable
        // create new book with book object from form
    const newBook = req.body;
    await Book.create(newBook);

    res.redirect(`/books`);
}));

// route to show book detail 
router.get('/:id', asyncHandler( async( req, res ) => {
    // find book with id in URL and pass to template
        // render update book template if there is a book with the id in the URL
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    if(book) {
        res.render('update-book', { book });
    } else {
        res.sendStatus(404);
    }

}));

// route to update book
router.post('/:id', asyncHandler( async( req, res ) => {
    // find book using ID from URL
    const bookId = req.params.id;
    const updatedBook = req.body;
    const book = await Book.findByPk(bookId);

    try {
        // if book exists, update book and redirect to home page
        if(book) {
            await book.update(updatedBook);
            res.redirect('/books');
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        console.error("Error: ", error);
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
