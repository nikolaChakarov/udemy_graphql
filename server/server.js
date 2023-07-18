import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
    schema {
        query: Query
    }

    type Query {
        greeting: String
    }
`;

const resolvers = {
	Query: {
		greeting: () => 'Hello World!',
	},
};

const server = new ApolloServer({ typeDefs, resolvers });
startStandaloneServer(server, {
	listen: {
		port: 9000,
	},
}).then((res) => console.log(`Server is listening at port: ${res.url}`));
