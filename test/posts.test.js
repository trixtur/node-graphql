const { postResolvers } = require('../controllers/posts');

// Mock the database models
jest.mock('../models', () => ({
  post: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock lodash find function
jest.mock('lodash', () => ({
  find: jest.fn(),
  filter: jest.fn(),
  merge: jest.fn(),
}));

const db = require('../models');
const { find } = require('lodash');

describe('Post Controller Tests', () => {
  beforeEach(() => {
    // Clear all mock function calls before each test
    jest.clearAllMocks();
  });

  describe('Query Resolvers', () => {
    describe('posts', () => {
      test('should return all posts', async () => {
        const mockPosts = [
          { id: 1, title: 'First Post', authorId: 1, votes: 5 },
          { id: 2, title: 'Second Post', authorId: 2, votes: 10 },
        ];
        db.post.findAll.mockResolvedValue(mockPosts);

        const result = await postResolvers.Query.posts(null, {});

        expect(db.post.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockPosts);
      });

      test('should return empty array when no posts exist', async () => {
        db.post.findAll.mockResolvedValue([]);

        const result = await postResolvers.Query.posts(null, {});

        expect(result).toEqual([]);
      });
    });

    describe('post', () => {
      test('should return a specific post by id', async () => {
        const mockPost = { id: 1, title: 'Test Post', authorId: 1, votes: 0 };
        db.post.findById.mockResolvedValue(mockPost);

        const result = await postResolvers.Query.post(null, { id: 1 });

        expect(db.post.findById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockPost);
      });

      test('should return null for non-existent post', async () => {
        db.post.findById.mockResolvedValue(null);

        const result = await postResolvers.Query.post(null, { id: 999 });

        expect(db.post.findById).toHaveBeenCalledWith(999);
        expect(result).toBeNull();
      });
    });
  });

  describe('Mutation Resolvers', () => {
    describe('createPost', () => {
      test('should create a new post with title and authorId', async () => {
        const mockPost = { id: 1, title: 'New Post', authorId: 1, votes: 0 };
        db.post.create.mockResolvedValue(mockPost);

        const result = await postResolvers.Mutation.createPost(
          null,
          { title: 'New Post', authorId: 1 }
        );

        expect(db.post.create).toHaveBeenCalledWith({
          title: 'New Post',
          authorId: 1,
          votes: 0,
        });
        expect(result).toEqual(mockPost);
      });

      test('should initialize votes to 0 when creating a post', async () => {
        const mockPost = { id: 2, title: 'Another Post', authorId: 2, votes: 0 };
        db.post.create.mockResolvedValue(mockPost);

        const result = await postResolvers.Mutation.createPost(
          null,
          { title: 'Another Post', authorId: 2 }
        );

        expect(db.post.create).toHaveBeenCalledWith(
          expect.objectContaining({ votes: 0 })
        );
        expect(result.votes).toBe(0);
      });
    });

    describe('deletePost', () => {
      test('should delete a post and return result', async () => {
        const mockPost = {
          id: 1,
          title: 'Post to Delete',
          destroy: jest.fn().mockResolvedValue(true),
        };
        db.post.findById.mockResolvedValue(mockPost);

        const result = await postResolvers.Mutation.deletePost(null, { postId: 1 });

        expect(db.post.findById).toHaveBeenCalledWith(1);
        expect(mockPost.destroy).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
      });

      test('should handle deletion of non-existent post', async () => {
        db.post.findById.mockResolvedValue(null);

        // This should throw an error when trying to call destroy on null
        await expect(async () => {
          await postResolvers.Mutation.deletePost(null, { postId: 999 });
        }).rejects.toThrow();
      });
    });

    describe('upvotePost', () => {
      test('should increment votes by 1', async () => {
        const mockPost = {
          id: 1,
          title: 'Post to Upvote',
          votes: 5,
          save: jest.fn().mockResolvedValue(true),
        };
        db.post.findById.mockResolvedValue(mockPost);

        const result = await postResolvers.Mutation.upvotePost(null, { postId: 1 });

        expect(db.post.findById).toHaveBeenCalledWith(1);
        expect(mockPost.votes).toBe(6);
        expect(mockPost.save).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockPost);
      });

      test('should throw error when post does not exist', async () => {
        db.post.findById.mockResolvedValue(null);

        await expect(
          postResolvers.Mutation.upvotePost(null, { postId: 999 })
        ).rejects.toThrow("Couldn't find post with id 999");
      });

      test('should upvote post with zero votes', async () => {
        const mockPost = {
          id: 2,
          title: 'New Post',
          votes: 0,
          save: jest.fn().mockResolvedValue(true),
        };
        db.post.findById.mockResolvedValue(mockPost);

        const result = await postResolvers.Mutation.upvotePost(null, { postId: 2 });

        expect(mockPost.votes).toBe(1);
        expect(result.votes).toBe(1);
      });

      test('should handle multiple upvotes correctly', async () => {
        const mockPost = {
          id: 3,
          title: 'Popular Post',
          votes: 100,
          save: jest.fn().mockResolvedValue(true),
        };
        db.post.findById.mockResolvedValue(mockPost);

        const result = await postResolvers.Mutation.upvotePost(null, { postId: 3 });

        expect(mockPost.votes).toBe(101);
        expect(result.votes).toBe(101);
      });
    });
  });

  describe('Post Resolvers', () => {
    describe('author', () => {
      test('should return author for a post', () => {
        const mockAuthor = { id: 1, firstName: 'Tom', lastName: 'Coleman' };
        const mockPost = { id: 1, title: 'Test Post', authorId: 1 };
        
        // Mock the global authors array that's referenced in the resolver
        global.authors = [mockAuthor];
        find.mockReturnValue(mockAuthor);

        const result = postResolvers.Post.author(mockPost);

        expect(find).toHaveBeenCalledWith(global.authors, { id: mockPost.authorId });
        expect(result).toEqual(mockAuthor);
      });

      test('should return undefined when author not found', () => {
        const mockPost = { id: 1, title: 'Test Post', authorId: 999 };
        
        global.authors = [];
        find.mockReturnValue(undefined);

        const result = postResolvers.Post.author(mockPost);

        expect(result).toBeUndefined();
      });
    });
  });
});
