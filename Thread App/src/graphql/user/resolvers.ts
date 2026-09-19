import UserService, { type CreateUserPayload, type GetUserTokenPayload } from '../../services/user.js';

// Query resolvers for user-related read operations.
const queries = {
    // Simple health/demo query used to validate GraphQL is responding.
    hello: () => "Hey there I am a Graphql Query Resolver",

    // Example greeting query for testing request arguments.
    say: (_: any, { name }: { name: string }) => `Hello ${name} Welcome to Thread`,

    // Debug helper: logs the GraphQL context object passed by Apollo.
    getContext: (_: any, _p1: any, context: any) => {
        console.log("My Context", context);
        return "Done";
    },

    // Returns a JWT for valid login credentials.
    getUserToken: async (_: any, payload: GetUserTokenPayload) => {
        const token = await UserService.getUserToken(payload);
        return token;
    },

    // Retrieves the currently logged-in user from the auth context.
    getCurrentLoggedInUser: async (_: any, _parameter: any, context: any) => {
        if (context && context.user) {
            const id = context.user.id;
            const user = await UserService.getUserById(id);
            return user;
        }

        throw new Error("User not known");
    }
};

// Mutation resolvers for user write operations.
const mutations = {
    // Creates a user in the database and returns the created user ID.
    createUser: async (_: any, payload: CreateUserPayload) => {
        const user = await UserService.createUser(payload);
        return user.id;
    }
};

export const resolvers = { queries, mutations };