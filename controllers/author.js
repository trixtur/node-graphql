const db = require('..//models');
const { find, filter, merge } = require('lodash');

// Mutations for Authors
const authorResolvers = {
    Query: {
        author: (_, {id}) => {
            return db.author.findById(id);
        },
    },
    Mutation: {
        createAuthor: (_,{firstName,lastName}) => {
            const author = {firstName,lastName};
            return db.author.create(author);
        },
        deleteAuthor: (_,{authorId}) => {
            let index = authors.findIndex(author => author.id === authorId);
            authors.splice(index,1);
            return true;
        },
    },
    Author: {
        posts: (author) => author.getPosts(),
    },
};

const authorTypeDef = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }

    # this set of mutations is for Authors:
    extend type Mutation {
        createAuthor (
            firstName: String!
            lastName: String!
        ): Author
        updateAuthor (
            authorId: Int!
            firstName: String
            lastName: String
        ): Author
        deleteAuthor (
            authorId: Int!
        ): Boolean
    }
`;

/*
const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', lastName: 'Novikov' },
  { id: 4, firstName: 'Ben', lastName: 'Payne' },
];
*/

module.exports.authorTypeDef = authorTypeDef;
module.exports.authorResolvers = authorResolvers;
