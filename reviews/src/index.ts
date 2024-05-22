import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';

const typeDefs = gql`

  extend schema @link(url: "https://specs.apollo.dev/federation/v2.7", import: ["@key", "@shareable"])

  type BookReview @key(fields: "id") @shareable {
    id: ID!
    comment: String
  }
  
  type Query {
    reviews: [BookReview]
  }
`;

const bookReviews = [
  {
    id: "1",
    comment: 'The Awakening is a very good book. Good stuff.'
  },
  {
    id: "2",
    comment: 'City of Glass is an excellent read. Good read.'
  },
  {
    id: "3",
    comment: 'turbulence times is a good book of our times. Demo comment'
  },
  {
    id: "4",
    comment: 'you will never walk alone'
  },
  {
    id: "100",
    comment: 'you will never walk alone'
  },
  {
    id: "200",
    comment: 'you will never walk alone'
  },
  {
    id: "300",
    comment: 'you will never walk alone'
  },
];

const resolvers = {
  Query: {
    reviews: () => bookReviews,
    reviewBy: (a, { id }, c) => {  
      console.log(id);
      return bookReviews.filter(x => x.id == id)[0];
   },
  },  
  BookReview: {
    __resolveReference(review) {
      console.log("reviews subgraphs - bookreview resolving types.", review);
      return bookReviews.filter(x => x.id == review.id)[0];
    }
   } 
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});


const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server Book reviews listening at: ${url}`);
