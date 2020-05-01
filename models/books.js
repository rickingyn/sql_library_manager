'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model { }
    Book.init({
        title: {
            type: sequelize.STRING,
            validate: {
                notNull: {
                    msg: "Please enter a value for 'title'"
                },
                notEmpty: {
                    msg: "Please enter a value for 'title'"
                }
            }
        },
        author: {
            type: sequelize.STRING,
            validate: {
                notNull: {
                    msg: "Please enter a value for 'author'"
                },
                notEmpty: {
                    msg: "Please enter a value for 'author'"
                }
            }
        },
        genre: Sequelize.STRING,
        year: Sequelize.INTEGER
    }, { sequelize });

    return Book;
}