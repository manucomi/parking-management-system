import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const findAll = async () => {
    try {
        console.log('residentService.findAll - Starting query...');
        console.log('Pool:', !!pool);
        const result = await pool.query(
            'SELECT * FROM residents ORDER BY created_at DESC',
        );
        console.log(
            'residentService.findAll - Query successful, rows:',
            result.rows.length,
        );
        return result.rows;
    } catch (error) {
        console.error('residentService.findAll - Query FAILED');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);
        throw error;
    }
};

export const findById = async (id) => {
    const result = await pool.query('SELECT * FROM residents WHERE id = $1', [
        id,
    ]);

    if (result.rows.length === 0) {
        throw new AppError('Resident not found', 404);
    }

    return result.rows[0];
};

export const create = async (data) => {
    const { name, email, phone, building, apartment_number, has_car } = data;

    const result = await pool.query(
        `INSERT INTO residents (name, email, phone, building, apartment_number, has_car)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, email, phone, building, apartment_number, has_car || false],
    );

    return result.rows[0];
};

export const update = async (id, data) => {
    const { name, email, phone, building, apartment_number, has_car } = data;

    const result = await pool.query(
        `UPDATE residents 
         SET name = COALESCE($1, name),
             email = COALESCE($2, email),
             phone = COALESCE($3, phone),
             building = COALESCE($4, building),
             apartment_number = COALESCE($5, apartment_number),
             has_car = COALESCE($6, has_car),
             updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [name, email, phone, building, apartment_number, has_car, id],
    );

    if (result.rows.length === 0) {
        throw new AppError('Resident not found', 404);
    }

    return result.rows[0];
};

export const remove = async (id) => {
    const result = await pool.query(
        'DELETE FROM residents WHERE id = $1 RETURNING id',
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError('Resident not found', 404);
    }

    return result.rows[0];
};
