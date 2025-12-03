const { authorResolvers } = require('../controllers/author');

// Mock the database models
jest.mock('../models', () => ({
  author: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));

const db = require('../models');

describe('Author Controller Tests', () => {
  beforeEach(() => {
    // Clear all mock function calls before each test
    jest.clearAllMocks();
  });

  describe('Query Resolvers', () => {
    describe('authors', () => {
      test('should return all authors', async () => {
        const mockAuthors = [
          { id: 1, firstName: 'Tom', lastName: 'Coleman' },
          { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
        ];
        db.author.findAll.mockResolvedValue(mockAuthors);

        const result = await authorResolvers.Query.authors(null, {});

        expect(db.author.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockAuthors);
      });

      test('should return empty array when no authors exist', async () => {
        db.author.findAll.mockResolvedValue([]);

        const result = await authorResolvers.Query.authors(null, {});

        expect(result).toEqual([]);
      });
    });

    describe('author', () => {
      test('should return a specific author by id', async () => {
        const mockAuthor = { id: 1, firstName: 'Tom', lastName: 'Coleman' };
        db.author.findById.mockResolvedValue(mockAuthor);

        const result = await authorResolvers.Query.author(null, { id: 1 });

        expect(db.author.findById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockAuthor);
      });

      test('should return null for non-existent author', async () => {
        db.author.findById.mockResolvedValue(null);

        const result = await authorResolvers.Query.author(null, { id: 999 });

        expect(db.author.findById).toHaveBeenCalledWith(999);
        expect(result).toBeNull();
      });
    });
  });

  describe('Mutation Resolvers', () => {
    describe('createAuthor', () => {
      test('should create a new author with firstName and lastName', async () => {
        const mockAuthor = { id: 1, firstName: 'John', lastName: 'Doe' };
        db.author.create.mockResolvedValue(mockAuthor);

        const result = await authorResolvers.Mutation.createAuthor(
          null,
          { firstName: 'John', lastName: 'Doe' }
        );

        expect(db.author.create).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
        });
        expect(result).toEqual(mockAuthor);
      });

      test('should create author with only required fields', async () => {
        const mockAuthor = { id: 2, firstName: 'Jane', lastName: 'Smith' };
        db.author.create.mockResolvedValue(mockAuthor);

        const result = await authorResolvers.Mutation.createAuthor(
          null,
          { firstName: 'Jane', lastName: 'Smith' }
        );

        expect(db.author.create).toHaveBeenCalledWith({
          firstName: 'Jane',
          lastName: 'Smith',
        });
        expect(result).toEqual(mockAuthor);
      });
    });
  });

  describe('Author Resolvers', () => {
    describe('posts', () => {
      test('should return posts for an author', async () => {
        const mockPosts = [
          { id: 1, title: 'Post 1', authorId: 1 },
          { id: 2, title: 'Post 2', authorId: 1 },
        ];
        const mockAuthor = {
          id: 1,
          firstName: 'Tom',
          lastName: 'Coleman',
          getPosts: jest.fn().mockResolvedValue(mockPosts),
        };

        const result = await authorResolvers.Author.posts(mockAuthor);

        expect(mockAuthor.getPosts).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockPosts);
      });

      test('should return empty array when author has no posts', async () => {
        const mockAuthor = {
          id: 1,
          firstName: 'Tom',
          lastName: 'Coleman',
          getPosts: jest.fn().mockResolvedValue([]),
        };

        const result = await authorResolvers.Author.posts(mockAuthor);

        expect(result).toEqual([]);
      });
    });
  });
});
