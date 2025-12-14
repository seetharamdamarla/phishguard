import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Connect to database
export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Prisma Connected to PostgreSQL (Supabase)');
        console.log(`📊 Database: ${process.env.DATABASE_URL?.split('/').pop()?.split('?')[0] || 'phishguard'}`);
    } catch (error) {
        console.error(`❌ Prisma Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// Disconnect from database
export const disconnectDB = async () => {
    await prisma.$disconnect();
};

export default prisma;
