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
router.post('/new', asyncHandler( async( req, res ) => {
    // pass book object from form into variable
        // create new book with book object from form
    const newBook = req.body;
    await Book.create(newBook);

    res.redirect(`/books`);
}));

// route to show book detail 
router.get('/:id', ( req, res ) => {
    res.send('Book ID');
});

// route to update book
router.post('/:id', ( req, res ) => {
    // post book
})

// route to delete book
router.get('/:id/delete', ( req, res ) => {
    
});

module.exports = router;
