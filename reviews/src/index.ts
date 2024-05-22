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
    comment: 'The Awakening is a very good book'
  },
  {
    id: "2",
    comment: 'City of Glass is an excellent read'
  },
  {
    id: "3",
    comment: 'turbulence times is a good book of our times'
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

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
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
      return bookReviews.filter(x => x.id == review.id)[0]; // { id: review.id, comment: 'Alice' };
    }
   }
  //},
  // Reviews: {
  //   __resolveReference(id) {
  //     console.log(id);
  //     return {id: "99", comment: "back for good"}
  //   } 
  // Book: {
  //   // this reference resolver is optional - Apollo Server provides it for us by default
  //   __resolveReference(referencedLocation) {
  //     return referencedLocation;
  //   },
  //   overallRating: ({id}, _, {dataSources}) => {
  //     console.log('overall ratings', id);
  //     //return dataSources.reviewsAPI.getOverallRatingForLocation(id);
  //   },
  // }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server Book reviews listening at: ${url}`);
