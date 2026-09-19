import { prismaClient } from '../../lib/db.js';

const queries = {
    // Simple health/demo query for testing the GraphQL endpoint.
    hello: () => "Hey there I am a Graphql Query Resolver",
    say: (_ : any, { name }: { name: string }) => `Hello ${name} Welcome to Thread`
};

const mutations = {
    // Persist a new user record in PostgreSQL via Prisma.
    createUser: async (
        _ : any,
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
        return result.id;
    }
};

export const resolvers = { queries, mutations };