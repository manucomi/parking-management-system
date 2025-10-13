import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const findAll = async (status) => {
    let query = 'SELECT * FROM parking_spots';
    const params = [];

    if (status) {
        query += ' WHERE status = $1';
        params.push(status);
    }

    query += ' ORDER BY building, number';

    const result = await pool.query(query, params);
    return result.rows;
};

export const findById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM parking_spots WHERE id = $1',
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError('Parking spot not found', 404);
    }

    return result.rows[0];
};

export const create = async (data) => {
    const { number, building, level, type } = data;

    const result = await pool.query(
        `INSERT INTO parking_spots (number, building, level, type, status)
         VALUES ($1, $2, $3, $4, 'available')
         RETURNING *`,
        [number, building, level || '1', type || 'regular'],
    );

    return result.rows[0];
};

export const update = async (id, data) => {
    const { status, assigned_to } = data;

    const result = await pool.query(
        `UPDATE parking_spots 
         SET status = COALESCE($1, status),
             assigned_to = $2,
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [status, assigned_to, id],
    );

    if (result.rows.length === 0) {
        throw new AppError('Parking spot not found', 404);
    }

    return result.rows[0];
};

export const remove = async (id) => {
    const result = await pool.query(
        'DELETE FROM parking_spots WHERE id = $1 RETURNING id',
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError('Parking spot not found', 404);
    }

    return result.rows[0];
};
