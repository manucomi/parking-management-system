import pool from './config/database.js';

/**
 * Comprehensive data seeding script for Parking Management System
 * Populates the database with realistic test data
 */

const seedData = async () => {
    const client = await pool.connect();

    try {
        console.log('🌱 Starting comprehensive database seeding...\n');

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing data...');
        await client.query('TRUNCATE TABLE allocation_history CASCADE');
        await client.query('TRUNCATE TABLE raffle_participants CASCADE');
        await client.query('TRUNCATE TABLE raffles CASCADE');
        await client.query('TRUNCATE TABLE parking_spots CASCADE');
        await client.query('TRUNCATE TABLE residents CASCADE');
        await client.query('ALTER SEQUENCE residents_id_seq RESTART WITH 1');
        await client.query('ALTER SEQUENCE parking_spots_id_seq RESTART WITH 1');
        await client.query('ALTER SEQUENCE raffles_id_seq RESTART WITH 1');
        console.log('✅ Data cleared\n');

        // ========== RESIDENTS ==========
        console.log('👥 Seeding residents...');
        const residentsData = [
            // Building A
            { name: 'John Doe', email: 'john.doe@email.com', phone: '555-0101', building: 'A', apt: '101', hasCar: true },
            { name: 'Jane Smith', email: 'jane.smith@email.com', phone: '555-0102', building: 'A', apt: '102', hasCar: true },
            { name: 'Michael Johnson', email: 'michael.j@email.com', phone: '555-0103', building: 'A', apt: '103', hasCar: true },
            { name: 'Emily Davis', email: 'emily.davis@email.com', phone: '555-0104', building: 'A', apt: '104', hasCar: true },
            { name: 'Robert Wilson', email: 'robert.w@email.com', phone: '555-0105', building: 'A', apt: '105', hasCar: true },
            { name: 'Sarah Martinez', email: 'sarah.m@email.com', phone: '555-0106', building: 'A', apt: '106', hasCar: true },
            { name: 'David Anderson', email: 'david.a@email.com', phone: '555-0107', building: 'A', apt: '107', hasCar: false },
            { name: 'Lisa Taylor', email: 'lisa.taylor@email.com', phone: '555-0108', building: 'A', apt: '108', hasCar: true },
            { name: 'James Thomas', email: 'james.thomas@email.com', phone: '555-0109', building: 'A', apt: '109', hasCar: true },
            { name: 'Jennifer Garcia', email: 'jennifer.g@email.com', phone: '555-0110', building: 'A', apt: '110', hasCar: true },

            // Building B
            { name: 'William Brown', email: 'william.b@email.com', phone: '555-0201', building: 'B', apt: '201', hasCar: true },
            { name: 'Maria Rodriguez', email: 'maria.r@email.com', phone: '555-0202', building: 'B', apt: '202', hasCar: true },
            { name: 'Christopher Lee', email: 'chris.lee@email.com', phone: '555-0203', building: 'B', apt: '203', hasCar: true },
            { name: 'Patricia Hernandez', email: 'patricia.h@email.com', phone: '555-0204', building: 'B', apt: '204', hasCar: false },
            { name: 'Daniel Lopez', email: 'daniel.lopez@email.com', phone: '555-0205', building: 'B', apt: '205', hasCar: true },
            { name: 'Linda Gonzalez', email: 'linda.g@email.com', phone: '555-0206', building: 'B', apt: '206', hasCar: true },
            { name: 'Matthew Moore', email: 'matthew.m@email.com', phone: '555-0207', building: 'B', apt: '207', hasCar: true },
            { name: 'Barbara Jackson', email: 'barbara.j@email.com', phone: '555-0208', building: 'B', apt: '208', hasCar: true },
            { name: 'Joseph White', email: 'joseph.white@email.com', phone: '555-0209', building: 'B', apt: '209', hasCar: true },
            { name: 'Susan Harris', email: 'susan.harris@email.com', phone: '555-0210', building: 'B', apt: '210', hasCar: false },

            // Building C
            { name: 'Thomas Martin', email: 'thomas.martin@email.com', phone: '555-0301', building: 'C', apt: '301', hasCar: true },
            { name: 'Jessica Thompson', email: 'jessica.t@email.com', phone: '555-0302', building: 'C', apt: '302', hasCar: true },
            { name: 'Charles Clark', email: 'charles.clark@email.com', phone: '555-0303', building: 'C', apt: '303', hasCar: true },
            { name: 'Karen Lewis', email: 'karen.lewis@email.com', phone: '555-0304', building: 'C', apt: '304', hasCar: true },
            { name: 'Kevin Walker', email: 'kevin.walker@email.com', phone: '555-0305', building: 'C', apt: '305', hasCar: true },
            { name: 'Nancy Hall', email: 'nancy.hall@email.com', phone: '555-0306', building: 'C', apt: '306', hasCar: false },
            { name: 'Steven Allen', email: 'steven.allen@email.com', phone: '555-0307', building: 'C', apt: '307', hasCar: true },
            { name: 'Betty Young', email: 'betty.young@email.com', phone: '555-0308', building: 'C', apt: '308', hasCar: true },
            { name: 'Paul King', email: 'paul.king@email.com', phone: '555-0309', building: 'C', apt: '309', hasCar: true },
            { name: 'Helen Wright', email: 'helen.wright@email.com', phone: '555-0310', building: 'C', apt: '310', hasCar: true },

            // More residents without cars
            { name: 'Mark Scott', email: 'mark.scott@email.com', phone: '555-0401', building: 'A', apt: '201', hasCar: false },
            { name: 'Dorothy Green', email: 'dorothy.g@email.com', phone: '555-0402', building: 'B', apt: '301', hasCar: false },
            { name: 'George Baker', email: 'george.baker@email.com', phone: '555-0403', building: 'C', apt: '401', hasCar: false },
            { name: 'Sandra Adams', email: 'sandra.adams@email.com', phone: '555-0404', building: 'A', apt: '202', hasCar: false },
            { name: 'Kenneth Nelson', email: 'kenneth.n@email.com', phone: '555-0405', building: 'B', apt: '302', hasCar: false },
        ];

        for (const resident of residentsData) {
            await client.query(
                `INSERT INTO residents (name, email, phone, building, apartment_number, has_car)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [resident.name, resident.email, resident.phone, resident.building, resident.apt, resident.hasCar]
            );
        }
        console.log(`✅ Inserted ${residentsData.length} residents\n`);

        // ========== PARKING SPOTS ==========
        console.log('🅿️  Seeding parking spots...');
        const buildings = ['A', 'B', 'C'];
        const levels = ['1', '2', '3'];
        let spotCount = 0;

        for (const building of buildings) {
            for (const level of levels) {
                // Regular spots (10 per level per building)
                for (let i = 1; i <= 10; i++) {
                    const spotNumber = `${building}-${level}${String(i).padStart(2, '0')}`;
                    await client.query(
                        `INSERT INTO parking_spots (number, building, level, type, status)
                         VALUES ($1, $2, $3, $4, $5)`,
                        [spotNumber, building, level, 'regular', 'available']
                    );
                    spotCount++;
                }

                // Electric spots (2 per level per building)
                for (let i = 1; i <= 2; i++) {
                    const spotNumber = `${building}-${level}E${i}`;
                    await client.query(
                        `INSERT INTO parking_spots (number, building, level, type, status)
                         VALUES ($1, $2, $3, $4, $5)`,
                        [spotNumber, building, level, 'electric', 'available']
                    );
                    spotCount++;
                }
            }

            // Handicap spots (2 per building on level 1)
            for (let i = 1; i <= 2; i++) {
                const spotNumber = `${building}-H${i}`;
                await client.query(
                    `INSERT INTO parking_spots (number, building, level, type, status)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [spotNumber, building, '1', 'handicap', 'available']
                );
                spotCount++;
            }
        }
        console.log(`✅ Inserted ${spotCount} parking spots\n`);

        // ========== HISTORICAL RAFFLES ==========
        console.log('🎲 Seeding historical raffles...');
        
        // Raffle 1 - 3 months ago
        const raffle1Date = new Date();
        raffle1Date.setMonth(raffle1Date.getMonth() - 3);
        
        const raffle1Result = await client.query(
            `INSERT INTO raffles (status, created_at, executed_at)
             VALUES ($1, $2, $3)
             RETURNING id`,
            ['completed', raffle1Date, raffle1Date]
        );
        const raffle1Id = raffle1Result.rows[0].id;

        // Add participants to raffle 1 (20 residents)
        const raffle1Participants = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 21, 22, 23];
        for (const residentId of raffle1Participants) {
            await client.query(
                `INSERT INTO raffle_participants (raffle_id, resident_id, registered_at)
                 VALUES ($1, $2, $3)`,
                [raffle1Id, residentId, raffle1Date]
            );
        }

        // Assign some spots from raffle 1 (15 winners)
        const raffle1Winners = raffle1Participants.slice(0, 15);
        for (let i = 0; i < raffle1Winners.length; i++) {
            const residentId = raffle1Winners[i];
            const spotId = i + 1;
            
            await client.query(
                `UPDATE parking_spots SET status = 'occupied', assigned_to = $1 WHERE id = $2`,
                [residentId, spotId]
            );
            
            await client.query(
                `INSERT INTO allocation_history (resident_id, spot_id, raffle_id, assigned_at)
                 VALUES ($1, $2, $3, $4)`,
                [residentId, spotId, raffle1Id, raffle1Date]
            );
        }
        console.log(`✅ Created raffle 1: ${raffle1Participants.length} participants, ${raffle1Winners.length} winners\n`);

        // Raffle 2 - 2 months ago
        const raffle2Date = new Date();
        raffle2Date.setMonth(raffle2Date.getMonth() - 2);
        
        const raffle2Result = await client.query(
            `INSERT INTO raffles (status, created_at, executed_at)
             VALUES ($1, $2, $3)
             RETURNING id`,
            ['completed', raffle2Date, raffle2Date]
        );
        const raffle2Id = raffle2Result.rows[0].id;

        // Add participants to raffle 2 (18 residents)
        const raffle2Participants = [5, 6, 7, 8, 9, 13, 15, 16, 17, 19, 21, 22, 23, 24, 25, 27, 28, 29];
        for (const residentId of raffle2Participants) {
            await client.query(
                `INSERT INTO raffle_participants (raffle_id, resident_id, registered_at)
                 VALUES ($1, $2, $3)`,
                [raffle2Id, residentId, raffle2Date]
            );
        }

        // Assign some spots from raffle 2 (12 winners)
        const raffle2Winners = raffle2Participants.slice(0, 12);
        for (let i = 0; i < raffle2Winners.length; i++) {
            const residentId = raffle2Winners[i];
            const spotId = 16 + i; // Start from spot 16
            
            await client.query(
                `UPDATE parking_spots SET status = 'occupied', assigned_to = $1 WHERE id = $2`,
                [residentId, spotId]
            );
            
            await client.query(
                `INSERT INTO allocation_history (resident_id, spot_id, raffle_id, assigned_at)
                 VALUES ($1, $2, $3, $4)`,
                [residentId, spotId, raffle2Id, raffle2Date]
            );
        }
        console.log(`✅ Created raffle 2: ${raffle2Participants.length} participants, ${raffle2Winners.length} winners\n`);

        // Raffle 3 - 1 month ago
        const raffle3Date = new Date();
        raffle3Date.setMonth(raffle3Date.getMonth() - 1);
        
        const raffle3Result = await client.query(
            `INSERT INTO raffles (status, created_at, executed_at)
             VALUES ($1, $2, $3)
             RETURNING id`,
            ['completed', raffle3Date, raffle3Date]
        );
        const raffle3Id = raffle3Result.rows[0].id;

        // Add participants to raffle 3 (25 residents)
        const raffle3Participants = [1, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24, 26, 27, 28, 29, 30];
        for (const residentId of raffle3Participants) {
            await client.query(
                `INSERT INTO raffle_participants (raffle_id, resident_id, registered_at)
                 VALUES ($1, $2, $3)`,
                [raffle3Id, residentId, raffle3Date]
            );
        }

        // Assign some spots from raffle 3 (18 winners)
        const raffle3Winners = raffle3Participants.slice(0, 18);
        for (let i = 0; i < raffle3Winners.length; i++) {
            const residentId = raffle3Winners[i];
            const spotId = 28 + i; // Start from spot 28
            
            await client.query(
                `UPDATE parking_spots SET status = 'occupied', assigned_to = $1 WHERE id = $2`,
                [residentId, spotId]
            );
            
            await client.query(
                `INSERT INTO allocation_history (resident_id, spot_id, raffle_id, assigned_at)
                 VALUES ($1, $2, $3, $4)`,
                [residentId, spotId, raffle3Id, raffle3Date]
            );
        }
        console.log(`✅ Created raffle 3: ${raffle3Participants.length} participants, ${raffle3Winners.length} winners\n`);

        // ========== CURRENT ACTIVE RAFFLE ==========
        console.log('🎯 Creating active raffle...');
        const currentRaffleResult = await client.query(
            `INSERT INTO raffles (status, created_at)
             VALUES ($1, $2)
             RETURNING id`,
            ['active', new Date()]
        );
        const currentRaffleId = currentRaffleResult.rows[0].id;

        // Add participants to current raffle (15 residents who don't have parking)
        const currentParticipants = [7, 10, 12, 14, 18, 20, 24, 26, 30, 31, 32, 33, 34, 35];
        for (const residentId of currentParticipants) {
            await client.query(
                `INSERT INTO raffle_participants (raffle_id, resident_id, registered_at)
                 VALUES ($1, $2, $3)`,
                [currentRaffleId, residentId, new Date()]
            );
        }
        console.log(`✅ Created active raffle with ${currentParticipants.length} participants\n`);

        // Put some spots in maintenance
        await client.query(
            `UPDATE parking_spots 
             SET status = 'maintenance' 
             WHERE id IN (50, 51, 52)`
        );
        console.log('✅ Set 3 spots to maintenance status\n');

        // ========== FINAL STATS ==========
        console.log('📊 Final Database Statistics:');
        
        const residentCount = await client.query('SELECT COUNT(*) FROM residents');
        const spotsTotal = await client.query('SELECT COUNT(*) FROM parking_spots');
        const spotsAvailable = await client.query(`SELECT COUNT(*) FROM parking_spots WHERE status = 'available'`);
        const spotsOccupied = await client.query(`SELECT COUNT(*) FROM parking_spots WHERE status = 'occupied'`);
        const spotsMaintenance = await client.query(`SELECT COUNT(*) FROM parking_spots WHERE status = 'maintenance'`);
        const rafflesTotal = await client.query('SELECT COUNT(*) FROM raffles');
        const rafflesActive = await client.query(`SELECT COUNT(*) FROM raffles WHERE status = 'active'`);
        const rafflesCompleted = await client.query(`SELECT COUNT(*) FROM raffles WHERE status = 'completed'`);
        const allocationHistory = await client.query('SELECT COUNT(*) FROM allocation_history');

        console.log(`   👥 Residents: ${residentCount.rows[0].count}`);
        console.log(`   🅿️  Parking Spots:`);
        console.log(`      - Total: ${spotsTotal.rows[0].count}`);
        console.log(`      - Available: ${spotsAvailable.rows[0].count}`);
        console.log(`      - Occupied: ${spotsOccupied.rows[0].count}`);
        console.log(`      - Maintenance: ${spotsMaintenance.rows[0].count}`);
        console.log(`   🎲 Raffles:`);
        console.log(`      - Total: ${rafflesTotal.rows[0].count}`);
        console.log(`      - Active: ${rafflesActive.rows[0].count}`);
        console.log(`      - Completed: ${rafflesCompleted.rows[0].count}`);
        console.log(`   📜 Allocation History: ${allocationHistory.rows[0].count}`);

    } catch (error) {
        console.error('❌ Error seeding data:', error.message);
        console.error(error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
};

seedData()
    .then(() => {
        console.log('\n🎉 Database seeding complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Failed to seed database:', error);
        process.exit(1);
    });
