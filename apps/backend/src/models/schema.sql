-- Database schema for Parking Management System
-- Based on domain model diagram

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

-- Indexes for optimization
CREATE INDEX IF NOT EXISTS idx_residents_email ON residents(email);
CREATE INDEX IF NOT EXISTS idx_parking_spots_status ON parking_spots(status);
CREATE INDEX IF NOT EXISTS idx_parking_spots_assigned_to ON parking_spots(assigned_to);
CREATE INDEX IF NOT EXISTS idx_raffles_status ON raffles(status);
CREATE INDEX IF NOT EXISTS idx_raffle_participants_raffle_id ON raffle_participants(raffle_id);
CREATE INDEX IF NOT EXISTS idx_raffle_participants_resident_id ON raffle_participants(resident_id);
CREATE INDEX IF NOT EXISTS idx_allocation_history_resident_id ON allocation_history(resident_id);
CREATE INDEX IF NOT EXISTS idx_allocation_history_spot_id ON allocation_history(spot_id);
CREATE INDEX IF NOT EXISTS idx_allocation_history_raffle_id ON allocation_history(raffle_id);

