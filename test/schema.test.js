// Mock all dependencies before requiring the main file
jest.mock('express', () => {
  const mockApp = {
    use: jest.fn(),
    listen: jest.fn((port, callback) => {
      if (callback) callback();
      return { close: jest.fn() };
    }),
  };
  return jest.fn(() => mockApp);
});

jest.mock('express-graphql', () => {
  return jest.fn(() => jest.fn());
});

jest.mock('graphql-tools', () => ({
  makeExecutableSchema: jest.fn((config) => {
    return {
      typeDefs: config.typeDefs,
      resolvers: config.resolvers,
    };
  }),
}));

jest.mock('../controllers/author', () => ({
  authorTypeDef: `
    type Author {
      id: Int!
      firstName: String
      lastName: String
    }
    extend type Query {
      author(id: Int!): Author
      authors: [Author]
    }
  `,
  authorResolvers: {
    Query: {
      authors: jest.fn(),
      author: jest.fn(),
    },
  },
}));

jest.mock('../controllers/posts', () => ({
  postTypeDef: `
    type Post {
      id: Int!
      title: String
      votes: Int
    }
    extend type Query {
      post(id: Int!): Post
      posts: [Post]
    }
  `,
  postResolvers: {
    Query: {
      posts: jest.fn(),
      post: jest.fn(),
    },
  },
}));

jest.mock('lodash', () => ({
  find: jest.fn(),
  filter: jest.fn(),
  merge: jest.fn((...args) => Object.assign({}, ...args)),
}));

describe('GraphQL Schema Integration Tests', () => {
  let express;
  let expressGraphQL;
  let makeExecutableSchema;
  let authorController;
  let postsController;
  let merge;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Re-require modules to get fresh mocks
    express = require('express');
    expressGraphQL = require('express-graphql');
    makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
    authorController = require('../controllers/author');
    postsController = require('../controllers/posts');
    merge = require('lodash').merge;
  });

  afterEach(() => {
    // Clean up any lingering mocks
    jest.resetModules();
  });

  describe('Schema Creation', () => {
    test('should create executable schema with type definitions', () => {
      // Require index.js to trigger schema creation
      require('../index.js');

      expect(makeExecutableSchema).toHaveBeenCalledTimes(1);
      expect(makeExecutableSchema).toHaveBeenCalledWith(
        expect.objectContaining({
          typeDefs: expect.any(Array),
          resolvers: expect.any(Object),
        })
      );
    });

    test('should merge all type definitions', () => {
      require('../index.js');

      const callArgs = makeExecutableSchema.mock.calls[0][0];
      const typeDefs = callArgs.typeDefs;

      expect(typeDefs).toHaveLength(3);
      expect(typeDefs[0]).toContain('type Query');
      expect(typeDefs[0]).toContain('type Mutation');
      expect(typeDefs[1]).toContain('type Author');
      expect(typeDefs[2]).toContain('type Post');
    });

    test('should merge resolvers from all controllers', () => {
      require('../index.js');

      expect(merge).toHaveBeenCalledWith(
        postsController.postResolvers,
        authorController.authorResolvers
      );
    });
  });

  describe('Express Server Configuration', () => {
    test('should create express app', () => {
      require('../index.js');

      expect(express).toHaveBeenCalledTimes(1);
    });

    test('should configure GraphQL endpoint at /graphql', () => {
      require('../index.js');

      const mockApp = express();
      expect(mockApp.use).toHaveBeenCalledWith('/graphql', expect.any(Function));
    });

    test('should enable GraphiQL interface', () => {
      require('../index.js');

      expect(expressGraphQL).toHaveBeenCalledWith(
        expect.objectContaining({
          graphiql: true,
        })
      );
    });

    test('should configure schema in GraphQL endpoint', () => {
      require('../index.js');

      expect(expressGraphQL).toHaveBeenCalledWith(
        expect.objectContaining({
          schema: expect.any(Object),
        })
      );
    });

    test('should set rootValue to global', () => {
      require('../index.js');

      expect(expressGraphQL).toHaveBeenCalledWith(
        expect.objectContaining({
          rootValue: global,
        })
      );
    });

    test('should listen on port 80', () => {
      require('../index.js');

      const mockApp = express();
      expect(mockApp.listen).toHaveBeenCalledWith(80, expect.any(Function));
    });
  });

  describe('Type Definitions', () => {
    test('should include base Query type', () => {
      require('../index.js');

      const callArgs = makeExecutableSchema.mock.calls[0][0];
      const baseTypeDef = callArgs.typeDefs[0];

      expect(baseTypeDef).toContain('type Query');
      expect(baseTypeDef).toContain('blank: Int');
    });

    test('should include base Mutation type', () => {
      require('../index.js');

      const callArgs = makeExecutableSchema.mock.calls[0][0];
      const baseTypeDef = callArgs.typeDefs[0];

      expect(baseTypeDef).toContain('type Mutation');
      expect(baseTypeDef).toContain('blank: Int');
    });

    test('should include Author type definition', () => {
      require('../index.js');

      const callArgs = makeExecutableSchema.mock.calls[0][0];
      const typeDefs = callArgs.typeDefs;

      const authorTypeDef = typeDefs.find(def => def.includes('type Author'));
      expect(authorTypeDef).toBeDefined();
      expect(authorTypeDef).toContain('id: Int!');
      expect(authorTypeDef).toContain('firstName: String');
      expect(authorTypeDef).toContain('lastName: String');
    });

    test('should include Post type definition', () => {
      require('../index.js');

      const callArgs = makeExecutableSchema.mock.calls[0][0];
      const typeDefs = callArgs.typeDefs;

      const postTypeDef = typeDefs.find(def => def.includes('type Post'));
      expect(postTypeDef).toBeDefined();
      expect(postTypeDef).toContain('id: Int!');
      expect(postTypeDef).toContain('title: String');
      expect(postTypeDef).toContain('votes: Int');
    });
  });
});
