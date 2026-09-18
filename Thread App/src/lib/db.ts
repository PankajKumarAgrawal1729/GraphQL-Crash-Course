import { PrismaClient } from '@prisma/client';

// Single Prisma client instance reused across the app.
export const prismaClient = new PrismaClient();