// Prisma Database Initialization Script for PhishGuard
// Run this with: npm run init-db

import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const execAsync = promisify(exec);

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const initializeDatabase = async () => {
    try {
        console.log('🔄 Initializing Prisma database...\n');

        // Check if DATABASE_URL is set
        if (!process.env.DATABASE_URL) {
            console.error('❌ DATABASE_URL is not set in .env file');
            console.log('\n💡 Please add DATABASE_URL to your .env file:');
            console.log('   DATABASE_URL=mongodb://localhost:27017/phishguard');
            process.exit(1);
        }

        console.log(`📊 Database URL: ${process.env.DATABASE_URL.replace(/\/\/.*@/, '//***@')}\n`);

        // Push Prisma schema to database
        console.log('📤 Pushing Prisma schema to database...');
        const { stdout, stderr } = await execAsync('npx prisma db push');

        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);

        console.log('\n✅ PhishGuard database initialized successfully!');
        console.log('📊 Collections created: users, analyses');
        console.log('🔍 Indexes created for optimal performance');
        console.log('\n💡 Next steps:');
        console.log('   1. Run: npm run dev (to start the development server)');
        console.log('   2. Or run: npm start (to start the production server)');
        console.log('\n🎉 You can now start the application!');

    } catch (error) {
        console.error('\n❌ Database initialization failed:', error.message);
        if (error.stderr) {
            console.error('\nError details:', error.stderr);
        }
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Make sure MongoDB is running');
        console.log('   2. Check your DATABASE_URL in .env file');
        console.log('   3. Ensure you have network connectivity to your database');
        process.exit(1);
    }
};

// Run the initialization
initializeDatabase();
