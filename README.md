
run individual subgraph in location and reviews by going into each directory and then running npm start


start a new terminal
cd location 
npm start


start a new terminal
cd reviews 
npm start


To generate your supergraph:

rover supergraph compose --config ./supergraph.yaml --output supergraph.graphql

Once you have generated supergraph.graphql then you can start running using router, using the following command: 

router --dev --supergraph supergraph.graphql (quickstart)

if you wanted to make use of a external configuration file 

router --dev --supergraph supergraph.graphql --config router.yaml




