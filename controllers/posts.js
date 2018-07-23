const db = require('../models');
const { find, filter, merge } = require('lodash');

// Mutations for Posts
const postResolvers = {
    Query: {
        posts: (_, {}) => {
            return db.post.findAll();
        },
        post: (_, {id}) => {
            return db.post.findById(id);
        },
    },
    Mutation: {
        createPost: async (_,{title,authorId}) =>  {
            const post = {title,authorId,votes:0};
            return await db.post.create(post);
        },
        deletePost: async (_,{postId}) => {
            const post = await db.post.findById(postId);
            return post.destroy();
        },

        upvotePost: async (_, { postId }) => {
            const post = await db.post.findById(postId);
            if (!post) {
                throw new Error(`Couldn't find post with id ${postId}`);
            }
            post.votes += 1;
            post.save();
            return post;
        },
    },
    Post: {
        author: (post) => find(authors, { id: post.authorId }),
    },
};
const postTypeDef = `
  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }
  extend type Query {
    post(id: Int!): Post
    posts: [Post]
  }

    # this set of mutations is for Posts:
    extend type Mutation {
        upvotePost (
      postId: Int!
    ): Post
        createPost (
            title: String!
            authorId: Int!
        ): Post
        updatePost (
            postId: Int!
            title: String
            authorId: Int
        ): Post
        deletePost (
            postId: Int!
        ): Boolean
    }
`;


module.exports.postResolvers = postResolvers;
module.exports.postTypeDef = postTypeDef;
