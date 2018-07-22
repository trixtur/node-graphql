const { find, filter, merge } = require('lodash');
const {authorResolvers, authorTypeDef, authors } = require('./author');

// Mutations for Posts
const postResolvers = {
        Mutation: {
        createPost: (_,{title,authorId}) => {
          const lastPost = posts[posts.length-1];
          const post = {id:lastPost.id+1,title,authorId,votes:0};
          posts.push(post);
          return post;
        },
        deletePost: (_,{postId}) => {
          let index = posts.findIndex(post => post.id === postId);
          posts.splice(index,1);
          return true;
        },

        upvotePost: (_, { postId }) => {
          const post = find(posts, { id: postId });
          if (!post) {
            throw new Error(`Couldn't find post with id ${postId}`);
          }
          post.votes += 1;
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

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'Welcome to Apollo', votes: 3 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7 },
];

module.exports.postResolvers = postResolvers;
module.exports.posts = posts;
module.exports.postTypeDef = postTypeDef;
