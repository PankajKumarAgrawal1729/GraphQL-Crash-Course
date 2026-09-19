import UserService, { type CreateUserPayload, type GetUserTokenPayload } from '../../services/user.js';

const queries = {
    // Simple health/demo query for testing the GraphQL endpoint.
    hello: () => "Hey there I am a Graphql Query Resolver",
    say: (_: any, { name }: { name: string }) => `Hello ${name} Welcome to Thread`,
    getUserToken: async (_: any, payload: GetUserTokenPayload) => {
        const token = await UserService.getUserToken(payload);
        return token;
    }
};

const mutations = {
    // Persist a new user record in PostgreSQL via Prisma.
    createUser: async (
        _: any,
        payload: CreateUserPayload
    ) => {
        const user = await UserService.createUser(payload);
        return user.id;
    }
};

export const resolvers = { queries, mutations };