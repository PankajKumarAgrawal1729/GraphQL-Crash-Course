import { prismaClient } from '../lib/db.js';
import { createHmac, randomBytes } from 'crypto';
import JWT from 'jsonwebtoken';

export interface CreateUserPayload {
    firstName: string,
    lastName?: string,
    email: string,
    password: string
}

export interface GetUserTokenPayload {
    email: string,
    password: string
}

class UserService {
    private static generateHash(password: string, salt: string) {
        return createHmac('sha256', salt).update(password).digest('hex');
    }

    public static async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
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

    private static async getUserByEmail(email: string) {
        return await prismaClient.user.findUnique({ where: { email } });
    }

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

        const token = JWT.sign({ id: user.id, email}, process.env.JWT_SECRET!);
        return token;
    }
}

export default UserService;