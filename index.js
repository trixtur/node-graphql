// graphql-tools combines a schema string with resolvers.
const { find, filter, merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
var express = require('express');
var express_graphql = require('express-graphql');

// Construct a schema, using GraphQL schema language
const typeDefs = `
  # the schema allows the following query:
  type Query {
        blank: Int
  }

  # this schema allows the following mutation:
  type Mutation {
        blank: Int
  }
`;

// Provide resolver functions for your schema fields
const {authorTypeDef, authorResolvers} = require('./controllers/author');
const {postResolvers, postTypeDef} = require('./controllers/posts');


const schema = makeExecutableSchema({
  typeDefs:[typeDefs,authorTypeDef,postTypeDef],
  resolvers:merge(postResolvers,authorResolvers),
});


// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: global,
    graphiql: true
}));
app.listen(80, () => console.log('Express GraphQL Server Now Running On localhost:80/graphql'));
