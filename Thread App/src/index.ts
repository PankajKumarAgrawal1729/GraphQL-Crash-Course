import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    // because we need to parse JSON bodies for incoming requests, and graphql relies on JSON payloads
    app.use(express.json());

    // Create Graphql Server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String,
                say(name: String) : String
            }
        `,  // Schema
        resolvers: {
            Query: {
                hello: () => "Hey there I am a Graphql Query Resolver",
                say: (_, { name }: { name: String }) => `Hello ${name} Welcome to Thread`
            }
        }
    });

    // Start the Graphql Server
    await gqlServer.start();

    // Expose Graphql Server
    app.use('/graphql', expressMiddleware(gqlServer));

    app.get('/', (req, res) => {
        res.json({ message: "Thread Home Welcomes" })
    });

    app.listen(PORT, () => console.log(`Server Running at PORT: ${PORT}`));
}

init();