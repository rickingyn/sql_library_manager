'use strict';

const Sequelize = require('sequelize');

// create Book Model with Sequelize
    // define book fields
    // validation to title and author field; must not be empty or null
module.exports = (sequelize) => {
    class Book extends Sequelize.Model { }
    Book.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Name is required"
                },
                notEmpty: {
                    msg: "Name is required"
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Author is required"
                },
                notEmpty: {
                    msg: "Author is required"
                }
            }
        },
        genre: Sequelize.STRING,
        year: Sequelize.INTEGER
    }, { sequelize });

    return Book;
}