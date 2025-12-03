# Test Documentation

This directory contains automated tests for the node-graphql project. The tests ensure the correctness and robustness of the GraphQL server's business logic.

## Test Structure

The test suite is organized into the following test files:

### 1. `author.test.js`
Tests for the Author controller and resolvers (`controllers/author.js`):

- **Query Resolvers**:
  - `authors`: Tests retrieval of all authors
  - `author`: Tests retrieval of a specific author by ID
  - Edge cases: Empty results, non-existent authors

- **Mutation Resolvers**:
  - `createAuthor`: Tests creating new authors with firstName and lastName
  - Validates proper data structure passing to the database

- **Type Resolvers**:
  - `Author.posts`: Tests retrieval of posts associated with an author
  - Edge case: Authors with no posts

**Coverage**: 11 test cases

### 2. `posts.test.js`
Tests for the Post controller and resolvers (`controllers/posts.js`):

- **Query Resolvers**:
  - `posts`: Tests retrieval of all posts
  - `post`: Tests retrieval of a specific post by ID
  - Edge cases: Empty results, non-existent posts

- **Mutation Resolvers**:
  - `createPost`: Tests creating new posts with proper vote initialization
  - `deletePost`: Tests post deletion and error handling for non-existent posts
  - `upvotePost`: Tests vote increment functionality and comprehensive error handling
  - Edge cases: Upvoting non-existent posts, posts with zero votes, multiple upvotes

- **Type Resolvers**:
  - `Post.author`: Tests retrieval of author information for a post
  - Edge case: Posts with non-existent authors

**Coverage**: 17 test cases

### 3. `schema.test.js`
Tests for GraphQL schema integration (`index.js`):

- **Schema Creation**:
  - Tests executable schema generation with type definitions
  - Tests merging of all type definitions from different controllers
  - Tests resolver merging

- **Express Server Configuration**:
  - Tests Express app creation
  - Tests GraphQL endpoint configuration at `/graphql`
  - Tests GraphiQL interface enablement
  - Tests schema and rootValue configuration
  - Tests server listening on correct port

- **Type Definitions**:
  - Tests inclusion of base Query and Mutation types
  - Tests inclusion of Author and Post type definitions
  - Validates all type fields are present

**Coverage**: 13 test cases

### 4. `typedefs.test.js`
Tests for GraphQL type definitions and resolver structure:

- **Author Type Definition**:
  - Tests Author type field definitions
  - Tests Query type extensions for authors
  - Tests Mutation type extensions for authors
  - Tests return type correctness

- **Post Type Definition**:
  - Tests Post type field definitions
  - Tests Query type extensions for posts
  - Tests Mutation type extensions for posts
  - Tests return type correctness

- **Resolver Structure**:
  - Validates resolver object structure for both controllers
  - Ensures all resolver functions are callable
  - Verifies proper Query, Mutation, and Type resolver organization

**Coverage**: 9 test cases

### 5. `ini.test.js` (Pre-existing)
Tests for the `ini` package functionality:

- Tests parsing of INI format strings
- Tests stringification of objects to INI format
- Tests round-trip conversion
- Edge cases: Empty sections, numbers, booleans

**Coverage**: 8 test cases

## Running Tests

To run all tests:
```bash
npm test
```

To run tests in watch mode:
```bash
npm test -- --watch
```

To run tests with coverage:
```bash
npm test -- --coverage
```

To run a specific test file:
```bash
npm test -- author.test.js
```

## Test Framework

- **Framework**: Jest 30.2.0
- **Mocking**: Jest's built-in mocking capabilities are used to mock database models and dependencies
- **Assertions**: Jest's expect API with matchers

## Test Philosophy

The test suite follows these principles:

1. **Unit Testing**: Each controller/resolver is tested in isolation using mocks
2. **Edge Case Coverage**: Tests include error conditions and boundary cases
3. **Comprehensive Coverage**: All major business workflows are tested
4. **Clear Documentation**: Each test has descriptive names explaining what is being tested
5. **Mock Database**: Database models are mocked to avoid requiring a real database connection

## Test Coverage Summary

- **Total Test Suites**: 5
- **Total Tests**: 58
- **Components Tested**:
  - Author controller (Query, Mutation, Type resolvers)
  - Post controller (Query, Mutation, Type resolvers)
  - GraphQL schema integration
  - Type definitions and structure
  - INI package (pre-existing)

## Adding New Tests

When adding new business logic:

1. Create a new test file in the `test/` directory following the naming convention `<component>.test.js`
2. Use Jest's mocking capabilities to isolate the component under test
3. Write tests for:
   - Happy path scenarios
   - Edge cases and error conditions
   - Boundary values
4. Ensure tests are descriptive and well-organized using `describe` and `test` blocks
5. Run tests to ensure they pass before committing

## Continuous Integration

Tests are automatically run as part of the CI/CD pipeline. All tests must pass before code can be merged.

## Notes

- Database models are mocked in tests to avoid requiring database setup
- The Express server is mocked in schema tests to prevent actual server startup
- Console logs from server startup appear in test output but do not affect test results
- Tests are designed to be fast and isolated, with no external dependencies
