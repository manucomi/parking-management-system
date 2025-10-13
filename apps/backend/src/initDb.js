import pool from './config/database.js';

const initDatabase = async () => {
    const client = await pool.connect();

    try {
        console.log('🔧 Initializing database schema...');

        // Create tables
        await client.query(`
            CREATE TABLE IF NOT EXISTS residents (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(50),
                building VARCHAR(10) NOT NULL,
                apartment_number VARCHAR(10) NOT NULL,
                has_car BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS parking_spots (
                id SERIAL PRIMARY KEY,
                number VARCHAR(10) NOT NULL,
                building VARCHAR(10) NOT NULL,
                level VARCHAR(10) DEFAULT '1',
                type VARCHAR(20) DEFAULT 'regular',
                status VARCHAR(20) DEFAULT 'available',
                assigned_to INTEGER REFERENCES residents(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(building, number)
            );

            CREATE TABLE IF NOT EXISTS raffles (
                id SERIAL PRIMARY KEY,
                status VARCHAR(20) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT NOW(),
                executed_at TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS raffle_participants (
                id SERIAL PRIMARY KEY,
                raffle_id INTEGER REFERENCES raffles(id) ON DELETE CASCADE,
                resident_id INTEGER REFERENCES residents(id) ON DELETE CASCADE,
                registered_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(raffle_id, resident_id)
            );

            CREATE TABLE IF NOT EXISTS allocation_history (
                id SERIAL PRIMARY KEY,
                resident_id INTEGER REFERENCES residents(id) ON DELETE CASCADE,
                spot_id INTEGER REFERENCES parking_spots(id) ON DELETE CASCADE,
                raffle_id INTEGER REFERENCES raffles(id) ON DELETE SET NULL,
                assigned_at TIMESTAMP DEFAULT NOW(),
                released_at TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_residents_email ON residents(email);
            CREATE INDEX IF NOT EXISTS idx_parking_spots_status ON parking_spots(status);
            CREATE INDEX IF NOT EXISTS idx_parking_spots_assigned_to ON parking_spots(assigned_to);
            CREATE INDEX IF NOT EXISTS idx_raffles_status ON raffles(status);
            CREATE INDEX IF NOT EXISTS idx_raffle_participants_raffle_id ON raffle_participants(raffle_id);
            CREATE INDEX IF NOT EXISTS idx_raffle_participants_resident_id ON raffle_participants(resident_id);
            CREATE INDEX IF NOT EXISTS idx_allocation_history_resident_id ON allocation_history(resident_id);
            CREATE INDEX IF NOT EXISTS idx_allocation_history_spot_id ON allocation_history(spot_id);
            CREATE INDEX IF NOT EXISTS idx_allocation_history_raffle_id ON allocation_history(raffle_id);
        `);

        console.log('✅ Database schema initialized successfully');

        // Insert sample data
        console.log('🌱 Seeding sample data...');

        await client.query(`
            INSERT INTO residents (name, email, phone, building, apartment_number, has_car)
            VALUES 
                ('John Doe', 'john@example.com', '1234567890', 'A', '101', true),
                ('Jane Smith', 'jane@example.com', '0987654321', 'A', '102', true),
                ('Bob Johnson', 'bob@example.com', '5555555555', 'B', '201', true)
            ON CONFLICT (email) DO NOTHING;
            
            INSERT INTO parking_spots (number, building, level, type, status)
            VALUES 
                ('A-001', 'A', '1', 'regular', 'available'),
                ('A-002', 'A', '1', 'regular', 'available'),
                ('A-003', 'A', '1', 'electric', 'available'),
                ('B-001', 'B', '1', 'regular', 'available'),
                ('B-002', 'B', '1', 'handicap', 'available')
            ON CONFLICT (building, number) DO NOTHING;
            
            INSERT INTO raffles (status, created_at)
            VALUES ('active', NOW())
            ON CONFLICT DO NOTHING;
        `);

        console.log('✅ Sample data seeded successfully');

        const resCount = await client.query('SELECT COUNT(*) FROM residents');
        const spotCount = await client.query(
            'SELECT COUNT(*) FROM parking_spots',
        );

        console.log(`📊 Database stats:`);
        console.log(`   - Residents: ${resCount.rows[0].count}`);
        console.log(`   - Parking Spots: ${spotCount.rows[0].count}`);
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
};

initDatabase()
    .then(() => {
        console.log('🎉 Database initialization complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    });
