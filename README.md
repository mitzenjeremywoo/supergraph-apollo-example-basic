
run individual subgraph in location and reviews by going into each directory and then running npm start


start a new terminal
cd location 
npm start


start a new terminal
cd reviews 
npm start


To generate your supergraph:

rover supergraph compose --config ./supergraph.yaml --output supergraph.graphql


