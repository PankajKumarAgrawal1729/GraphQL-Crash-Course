import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { prismaClient } from './lib/db.js';

// Start the Express app and attach GraphQL on top of it.
async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    // Express needs JSON middleware so GraphQL mutation payloads can be read.
    app.use(express.json());

    // GraphQL schema: query and mutation operations exposed to clients.
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }

            type Mutation {
                createUser(
                    firstName: String!
                    lastName: String!
                    email: String!
                    password: String!
                ): Boolean
            }
        `,
        resolvers: {
            Query: {
                // Simple health/demo query for testing the GraphQL endpoint.
                hello: () => "Hey there I am a Graphql Query Resolver",
                say: (_, { name }: { name: string }) => `Hello ${name} Welcome to Thread`
            },
            Mutation: {
                // Persist a new user record in PostgreSQL via Prisma.
                createUser: async (
                    _,
                    {
                        firstName,
                        lastName,
                        email,
                        password
                    }: {
                        firstName: string;
                        lastName: string;
                        email: string;
                        password: string;
                    }
                ) => {
                    const result = await prismaClient.user.create({
                        data: {
                            email,
                            password,
                            firstName,
                            lastName,
                            salt: "random_salt"
                        }
                    });

                    console.log("Create Result:", result);
                    return true;
                }
            }
        }
    });

    // Apollo needs to be started before middleware is attached.
    await gqlServer.start();

    // Expose the GraphQL server at /graphql.
    app.use('/graphql', expressMiddleware(gqlServer));

    // Root route for easy server verification.
    app.get('/', (req, res) => {
        res.json({ message: "Thread Home Welcomes" });
    });

    app.listen(PORT, () => console.log(`Server Running at PORT: ${PORT}`));
}

init();