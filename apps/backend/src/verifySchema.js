import pool from './config/database.js';

const verifySchema = async () => {
    const client = await pool.connect();

    try {
        console.log('🔍 Verifying Database Schema...\n');

        // Check tables
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);

        console.log('📊 Tables:');
        tables.rows.forEach((row) => console.log(`   ✓ ${row.table_name}`));
        console.log('');

        // Check foreign keys
        const foreignKeys = await client.query(`
            SELECT
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
                AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
            ORDER BY tc.table_name, kcu.column_name;
        `);

        console.log('🔗 Foreign Key Relationships:');
        foreignKeys.rows.forEach((fk) => {
            console.log(
                `   ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`,
            );
        });
        console.log('');

        // Check indexes
        const indexes = await client.query(`
            SELECT
                tablename,
                indexname,
                indexdef
            FROM pg_indexes
            WHERE schemaname = 'public'
            AND indexname LIKE 'idx_%'
            ORDER BY tablename, indexname;
        `);

        console.log('📑 Indexes:');
        indexes.rows.forEach((idx) => {
            console.log(`   ✓ ${idx.indexname} on ${idx.tablename}`);
        });
        console.log('');

        // Check row counts
        console.log('📈 Row Counts:');
        const residents = await client.query('SELECT COUNT(*) FROM residents');
        const spots = await client.query('SELECT COUNT(*) FROM parking_spots');
        const raffles = await client.query('SELECT COUNT(*) FROM raffles');
        const participants = await client.query(
            'SELECT COUNT(*) FROM raffle_participants',
        );
        const history = await client.query(
            'SELECT COUNT(*) FROM allocation_history',
        );

        console.log(`   Residents: ${residents.rows[0].count}`);
        console.log(`   Parking Spots: ${spots.rows[0].count}`);
        console.log(`   Raffles: ${raffles.rows[0].count}`);
        console.log(`   Raffle Participants: ${participants.rows[0].count}`);
        console.log(`   Allocation History: ${history.rows[0].count}`);

        console.log('\n✅ Schema verification complete!\n');
    } catch (error) {
        console.error('❌ Error verifying schema:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
};

verifySchema()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
