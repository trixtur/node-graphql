const { find, filter, merge } = require('lodash');
const {postResolvers, postTypeDef, posts} = require('./posts');

// Mutations for Authors
const authorResolvers = {
        Mutation: {
      createAuthor: (_,{firstName,lastName}) => {
        const lastAuthor = authors[authors.length-1];
        const author = {id:lastAuthor.id+1,firstName,lastName};
        authors.push(author);
        return author;
      },
      deleteAuthor: (_,{authorId}) => {
        let index = authors.findIndex(author => author.id === authorId);
        authors.splice(index,1);
        return true;
        },
    },
    Author: {
      posts: (author) => filter(posts, { authorId: author.id }),
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

const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', lastName: 'Novikov' },
  { id: 4, firstName: 'Ben', lastName: 'Payne' },
];

module.exports.authors = authors;
module.exports.authorTypeDef = authorTypeDef;
module.exports.authorResolvers = authorResolvers;
