import { ApolloServer } from '@apollo/server';
import { User } from './user/index.js';


export async function createApolloGraphqlServer() {
    // GraphQL schema: query and mutation operations exposed to clients.
        const gqlServer = new ApolloServer({
            typeDefs: `
                type Query {
                    ${User.queries}
                }
    
                type Mutation {
                    ${User.mutations}
                }
            `,
            resolvers: {
                Query: {
                    ...User.resolvers.queries
                },
                Mutation: {
                    ...User.resolvers.mutations
                }
            }
        });
    
        // Apollo needs to be started before middleware is attached.
        await gqlServer.start();

        return gqlServer;
}