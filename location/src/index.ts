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
  Book: {
    reviews(book) { 
      console.log('next step goes to resolving book', book);
      return { __typename: 'BookReview', id: book.reviews.id };
    }
  },
  BookReview: {
      // this reference resolver is optional - Apollo Server provides it for us by default
      // __resolveReference(referencedLocation) {
      //   console.log(' referenced locations');
      //   console.log(referencedLocation);
      //   return referencedLocation;
      // },
      reviews(reviews) {
        console.log(reviews);
        return  { __typename: 'BookReview', id: reviews.id };
     }
    }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4001 } });

console.log(`🚀 Server listening at: ${url}`);

