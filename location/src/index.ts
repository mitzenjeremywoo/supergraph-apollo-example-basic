import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';

const books = [
  {
    id: "1",
    title: 'The Awakening',
    author: 'Kate Chopin',
    reviews: {id: "1"}
  },
  {
    id: "2",
    title: 'City of Glass',
    author: 'Paul Auster',
    reviews: {id: "2"}
  },
  {
    id: "3",
    title: 'City of Angels',
    author: 'Paul Auster',
    reviews: {id: "3"}
  },
];

const typeDefs = gql`

  extend schema @link(url: "https://specs.apollo.dev/federation/v2.7", import: ["@key", "@external"])

  type Book @key(fields: "id") {
    id: ID!
    title: String
    author: String
    reviews: BookReview
  }

  extend type BookReview @key(fields: "id") {
    id: ID! @external
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }
`;

// extend type BookReview @key(fields: "id", resolvable: false) {
//   id: ID!
// }

const resolvers = {
  Query: {
    books: () => {
      console.log('books all');
      console.log(books);
      return books
    },
    // (parent, args, context, info)
    book: (a, { id }, c) => {  
      console.log('books single');
      return books.filter(x => x.id == id)[0];
    },
  },
  // We don't really need this.
  // Book: {
  //   reviews1(book) { 
  //     console.log('Query -> returns Book type. This gets resolved here. And given that it also has BookReview type, this get resolve in review subgraph', book);
  //     return { __typename: 'BookReview', id: book.reviews.id };
  //   }
  // }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4001 } });

console.log(`🚀 Server listening at: ${url}`);

