import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';

const books = [
  {
    id: "1",
    title: 'The Awakening',
    author: 'Kate Chopin',
    review: {
      id: 1
    }
  },
  {
    id: "2",
    title: 'City of Glass',
    author: 'Paul Auster',
    review: { 
      id: 2
    }
  },
  {
    id: "3",
    title: 'City of Angels',
    author: 'Paul Auster',
    review: { 
      id: 3
    }
  },
];

const bookReviews = [
  {  
    id: 1
   },
  {    
      id: 2
  },
  {    
    id: 3
  }
];

const typeDefs = gql`

  extend schema @link(url: "https://specs.apollo.dev/federation/v2.7", import: ["@key"])

  type Book @key(fields: "id") {
    id: ID!
    title: String
    author: String
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }
`;

// extend type BookReview @key(fields: "id", resolvable: false) {
//   id: ID!
// }

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    // (parent, args, context, info)
    book: (a, { id }, c) => {  
       return books.filter(x => x.id == id)[0];
    }
    //bookReviews: () => bookReviews
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, { listen: { port: 4001 } });

console.log(`🚀 Server listening at: ${url}`);

