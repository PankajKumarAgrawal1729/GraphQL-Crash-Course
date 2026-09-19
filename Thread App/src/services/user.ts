import { prismaClient } from '../lib/db.js';
import { createHmac, randomBytes } from 'crypto';
import JWT from 'jsonwebtoken';

// Input contract for creating a new user.
export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}

// Input contract for signing in a user and generating a token.
export interface GetUserTokenPayload {
    email: string;
    password: string;
}

class UserService {
    // Hash a plain-text password with a unique per-user salt.
    private static generateHash(password: string, salt: string) {
        return createHmac('sha256', salt).update(password).digest('hex');
    }

    // Create a new user record in PostgreSQL.
    public static async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;

        // Generate a random salt for this user so passwords are not stored in plain text.
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = this.generateHash(password, salt);

        const result = await prismaClient.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                ...(lastName && { lastName }),
                salt
            }
        });

        console.log("Create Result:", result);
        return result;
    }

    // Fetch a single user by email for login checks.
    private static async getUserByEmail(email: string) {
        return await prismaClient.user.findUnique({ where: { email } });
    }

    // Validate login credentials and return a JWT token.
    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;

        const user = await this.getUserByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        const salt = user.salt;
        const currentPasswordHash = this.generateHash(password, salt);

        if (user.password !== currentPasswordHash) {
            throw new Error("Invalid Password");
        }

        // JWT contains the user id and email so later requests can be authenticated.
        const token = JWT.sign({ id: user.id, email }, process.env.JWT_SECRET!);
        return token;
    }

    // Decode and verify a JWT using the application secret.
    public static decodeJWTToken(token: string) {
        return JWT.verify(token, process.env.JWT_SECRET!);
    }

    // Get a user by ID for authenticated requests.
    public static async getUserById(id: string) {
        return await prismaClient.user.findUnique({ where: { id } });
    }
}

export default UserService;