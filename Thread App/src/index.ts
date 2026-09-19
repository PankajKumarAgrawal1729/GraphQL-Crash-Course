import express from 'express';
import { expressMiddleware } from '@as-integrations/express5';
import { createApolloGraphqlServer } from './graphql/index.js';
import UserService from './services/user.js';


// Start the Express app and attach GraphQL on top of it.
async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    // Express needs JSON middleware so GraphQL mutation payloads can be read.
    app.use(express.json());

    const gqlServer = await createApolloGraphqlServer();

    // Expose the GraphQL server at /graphql.
    app.use('/graphql', expressMiddleware(gqlServer, {
        context: async ({ req }) => {
            // @ts-ignore
            const token = req.headers["token"];

            try {
                const user = UserService.decodeJWTToken(token as string);
                return { user };
            } catch (error) {
                return {};
            }
        }
    }));

    // Root route for easy server verification.
    app.get('/', (req, res) => {
        res.json({ message: "Thread Home Welcomes" });
    });

    app.listen(PORT, () => console.log(`Server Running at PORT: ${PORT}`));
}

init();