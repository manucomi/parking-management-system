import pool from '../config/database.js';

export const findByResident = async (residentId) => {
    const result = await pool.query(
        `SELECT ah.*, 
                ps.number as spot_number, ps.building, ps.level,
                r.executed_at as raffle_date
         FROM allocation_history ah
         JOIN parking_spots ps ON ps.id = ah.spot_id
         LEFT JOIN raffles r ON r.id = ah.raffle_id
         WHERE ah.resident_id = $1
         ORDER BY ah.assigned_at DESC`,
        [residentId],
    );

    return result.rows;
};
