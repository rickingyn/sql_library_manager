const express = require('express');
const router = express();
const Book = require('../models').Book;
//require Sequelize's operator 
const { Op } = require('sequelize');

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
    // pass URL search and page query into variable;
    // set other variables to be used in index template
    const { search, page } = req.query;
    let books;
    let totalBooks;
    
    // variables for pagination
    let totalPages;
    let limit = 5;
    let offset = limit * ( page - 1 ) || 0;
    
    // if search is not empty, render index view with searched book
    // else, render all books
    if(search) {
        // use Sequelize's operator 'Op' to search for books 
            // use LIKE operator to search title, author, genre, or year attributes if it contains search text
        // set limit and offset atribute for pagination
        books = await Book.findAll({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.like]: `%${ search }%`
                        }
                    },
                    {
                        author: {
                            [Op.like]: `%${ search }%`
                        }
                    },
                    {
                        genre: {
                            [Op.like]: `%${ search }%`
                        }
                    },
                    {
                        year: {
                            [Op.like]: `%${ search }%`
                        }
                    }
                ]
            },
            limit: `${ limit }`, 
            offset: `${ offset }`, 
            order: [['title', 'ASC']]
        });

        // find total number of results
            // length of books result without limit
        totalBooks = (await Book.findAll({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.like]: `%${ search }%`
                        }
                    },
                    {
                        author: {
                            [Op.like]: `%${ search }%`
                        }
                    },
                    {
                        genre: {
                            [Op.like]: `%${ search }%`
                        }
                    },
                    {
                        year: {
                            [Op.like]: `%${ search }%`
                        }
                    }
                ]
            }
        })).length;

        // set total pages to be total books / limit, rounded up
        totalPages = Math.ceil(totalBooks/5);
    } else {
        // use sequelize's findAll method to return all books and pass to index template
        // set limit and offset attribute for pagination
        books = await Book.findAll({
            limit: `${ limit }`,
            offset: `${ offset }`,
            order: [['title', 'ASC']]
        });

        // set totalBooks and totalPages variable
        totalBooks = (await Book.findAll()).length;
        totalPages = Math.ceil(totalBooks/5);
    } 

    // render index view and pass down variables
    res.render('index', { search, books, totalBooks, page, totalPages, title: 'Books' });
}));

// route to create book form
router.get('/new', ( req, res ) => {
    res.render('new-book', { title: 'New Book' });
}); 

// route to post a new book to the database
router.post('/new', asyncHandler( async( req, res ) => {
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
        // render error page and log error message in console if id is not found
        console.log("An error has occurred in the server.");
        res.render('error', { title: 'Page Not Found' });
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
            // render error page and log error message in console if id is not found
            console.log("An error has occurred in the server.");
            res.render('error', { title: 'Page Not Found' });
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
        // render error page and log error message in console if id is not found
        console.log("An error has occurred in the server.");
        res.render('error', { title: 'Page Not Found' });
    }
}));

module.exports = router;
