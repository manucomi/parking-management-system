import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const registerResident = async (residentId) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const raffleResult = await client.query(
            `SELECT id FROM raffles WHERE status = 'active' ORDER BY created_at DESC LIMIT 1`,
        );

        if (raffleResult.rows.length === 0) {
            throw new AppError('No active raffle found', 404);
        }

        const raffleId = raffleResult.rows[0].id;

        const existingRegistration = await client.query(
            'SELECT id FROM raffle_participants WHERE raffle_id = $1 AND resident_id = $2',
            [raffleId, residentId],
        );

        if (existingRegistration.rows.length > 0) {
            throw new AppError('Already registered for this raffle', 400);
        }

        const result = await client.query(
            `INSERT INTO raffle_participants (raffle_id, resident_id)
             VALUES ($1, $2)
             RETURNING *`,
            [raffleId, residentId],
        );

        await client.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const executeRaffle = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const raffleResult = await client.query(
            `SELECT id FROM raffles WHERE status = 'active' ORDER BY created_at DESC LIMIT 1`,
        );

        if (raffleResult.rows.length === 0) {
            throw new AppError('No active raffle found', 404);
        }

        const raffleId = raffleResult.rows[0].id;

        const participants = await client.query(
            'SELECT resident_id FROM raffle_participants WHERE raffle_id = $1',
            [raffleId],
        );

        const availableSpots = await client.query(
            "SELECT id FROM parking_spots WHERE status = 'available' ORDER BY RANDOM()",
        );

        if (availableSpots.rows.length === 0) {
            throw new AppError('No available parking spots', 400);
        }

        const winners = [];
        const maxWinners = Math.min(
            participants.rows.length,
            availableSpots.rows.length,
        );

        const shuffledParticipants = participants.rows.sort(
            () => Math.random() - 0.5,
        );

        for (let i = 0; i < maxWinners; i++) {
            const residentId = shuffledParticipants[i].resident_id;
            const spotId = availableSpots.rows[i].id;

            await client.query(
                `UPDATE parking_spots SET status = 'occupied', assigned_to = $1 WHERE id = $2`,
                [residentId, spotId],
            );

            await client.query(
                `INSERT INTO allocation_history (resident_id, spot_id, raffle_id, assigned_at)
                 VALUES ($1, $2, $3, NOW())`,
                [residentId, spotId, raffleId],
            );

            winners.push({ residentId, spotId });
        }

        await client.query(
            `UPDATE raffles SET status = 'completed', executed_at = NOW() WHERE id = $1`,
            [raffleId],
        );

        await client.query('COMMIT');

        return { raffleId, winners, totalWinners: winners.length };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const getLatestResults = async () => {
    const result = await pool.query(
        `SELECT r.id, r.executed_at, r.status,
                COUNT(ah.id) as total_winners
         FROM raffles r
         LEFT JOIN allocation_history ah ON ah.raffle_id = r.id
         WHERE r.status = 'completed'
         GROUP BY r.id
         ORDER BY r.executed_at DESC
         LIMIT 1`,
    );

    if (result.rows.length === 0) {
        return null;
    }

    const raffle = result.rows[0];

    const winners = await pool.query(
        `SELECT ah.resident_id, ah.spot_id, ah.assigned_at,
                res.name as resident_name,
                ps.number as spot_number, ps.building
         FROM allocation_history ah
         JOIN residents res ON res.id = ah.resident_id
         JOIN parking_spots ps ON ps.id = ah.spot_id
         WHERE ah.raffle_id = $1`,
        [raffle.id],
    );

    return { ...raffle, winners: winners.rows };
};

export const getCurrent = async () => {
    const result = await pool.query(
        `SELECT * FROM raffles WHERE status = 'active' ORDER BY created_at DESC LIMIT 1`,
    );

    if (result.rows.length === 0) {
        return null;
    }

    const raffle = result.rows[0];

    const participants = await pool.query(
        `SELECT COUNT(*) as total FROM raffle_participants WHERE raffle_id = $1`,
        [raffle.id],
    );

    return {
        ...raffle,
        totalParticipants: parseInt(participants.rows[0].total),
    };
};
