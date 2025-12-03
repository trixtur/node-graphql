// Mock the database models before requiring controllers
jest.mock('../models', () => ({
  author: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
  post: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));

const { authorTypeDef, authorResolvers } = require('../controllers/author');
const { postTypeDef, postResolvers } = require('../controllers/posts');

describe('Type Definitions Tests', () => {
  describe('Author Type Definition', () => {
    test('should define Author type with required fields', () => {
      expect(authorTypeDef).toContain('type Author');
      expect(authorTypeDef).toContain('id: Int!');
      expect(authorTypeDef).toContain('firstName: String');
      expect(authorTypeDef).toContain('lastName: String');
      expect(authorTypeDef).toContain('posts: [Post]');
    });

    test('should extend Query type with author queries', () => {
      expect(authorTypeDef).toContain('extend type Query');
      expect(authorTypeDef).toContain('author(id: Int!): Author');
      expect(authorTypeDef).toContain('authors: [Author]');
    });

    test('should extend Mutation type with author mutations', () => {
      expect(authorTypeDef).toContain('extend type Mutation');
      expect(authorTypeDef).toContain('createAuthor');
      expect(authorTypeDef).toContain('firstName: String!');
      expect(authorTypeDef).toContain('lastName: String!');
      expect(authorTypeDef).toContain('updateAuthor');
      expect(authorTypeDef).toContain('deleteAuthor');
      expect(authorTypeDef).toContain('authorId: Int!');
    });

    test('should define return types correctly', () => {
      expect(authorTypeDef).toContain('): Author');
      expect(authorTypeDef).toContain('): Boolean');
    });
  });

  describe('Post Type Definition', () => {
    test('should define Post type with required fields', () => {
      expect(postTypeDef).toContain('type Post');
      expect(postTypeDef).toContain('id: Int!');
      expect(postTypeDef).toContain('title: String');
      expect(postTypeDef).toContain('author: Author');
      expect(postTypeDef).toContain('votes: Int');
    });

    test('should extend Query type with post queries', () => {
      expect(postTypeDef).toContain('extend type Query');
      expect(postTypeDef).toContain('post(id: Int!): Post');
      expect(postTypeDef).toContain('posts: [Post]');
    });

    test('should extend Mutation type with post mutations', () => {
      expect(postTypeDef).toContain('extend type Mutation');
      expect(postTypeDef).toContain('upvotePost');
      expect(postTypeDef).toContain('postId: Int!');
      expect(postTypeDef).toContain('createPost');
      expect(postTypeDef).toContain('title: String!');
      expect(postTypeDef).toContain('authorId: Int!');
      expect(postTypeDef).toContain('updatePost');
      expect(postTypeDef).toContain('deletePost');
    });

    test('should define return types correctly', () => {
      expect(postTypeDef).toContain('): Post');
      expect(postTypeDef).toContain('): Boolean');
    });
  });

  describe('Resolver Structure', () => {
    test('authorResolvers should have correct structure', () => {
      expect(authorResolvers).toHaveProperty('Query');
      expect(authorResolvers).toHaveProperty('Mutation');
      expect(authorResolvers).toHaveProperty('Author');
      
      expect(authorResolvers.Query).toHaveProperty('authors');
      expect(authorResolvers.Query).toHaveProperty('author');
      
      expect(authorResolvers.Mutation).toHaveProperty('createAuthor');
      expect(authorResolvers.Mutation).toHaveProperty('deleteAuthor');
      
      expect(authorResolvers.Author).toHaveProperty('posts');
    });

    test('postResolvers should have correct structure', () => {
      expect(postResolvers).toHaveProperty('Query');
      expect(postResolvers).toHaveProperty('Mutation');
      expect(postResolvers).toHaveProperty('Post');
      
      expect(postResolvers.Query).toHaveProperty('posts');
      expect(postResolvers.Query).toHaveProperty('post');
      
      expect(postResolvers.Mutation).toHaveProperty('createPost');
      expect(postResolvers.Mutation).toHaveProperty('deletePost');
      expect(postResolvers.Mutation).toHaveProperty('upvotePost');
      
      expect(postResolvers.Post).toHaveProperty('author');
    });

    test('resolver functions should be callable', () => {
      expect(typeof authorResolvers.Query.authors).toBe('function');
      expect(typeof authorResolvers.Query.author).toBe('function');
      expect(typeof authorResolvers.Mutation.createAuthor).toBe('function');
      expect(typeof authorResolvers.Mutation.deleteAuthor).toBe('function');
      expect(typeof authorResolvers.Author.posts).toBe('function');
      
      expect(typeof postResolvers.Query.posts).toBe('function');
      expect(typeof postResolvers.Query.post).toBe('function');
      expect(typeof postResolvers.Mutation.createPost).toBe('function');
      expect(typeof postResolvers.Mutation.deletePost).toBe('function');
      expect(typeof postResolvers.Mutation.upvotePost).toBe('function');
      expect(typeof postResolvers.Post.author).toBe('function');
    });
  });
});
