import express from 'express';
import { expressMiddleware } from '@as-integrations/express5';
import { createApolloGraphqlServer } from './graphql/index.js';


// Start the Express app and attach GraphQL on top of it.
async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    // Express needs JSON middleware so GraphQL mutation payloads can be read.
    app.use(express.json());

    const gqlServer = await createApolloGraphqlServer();
    
    // Expose the GraphQL server at /graphql.
    app.use('/graphql', expressMiddleware(gqlServer));

    // Root route for easy server verification.
    app.get('/', (req, res) => {
        res.json({ message: "Thread Home Welcomes" });
    });

    app.listen(PORT, () => console.log(`Server Running at PORT: ${PORT}`));
}

init();