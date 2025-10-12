/**
 * ResidentService - Handles all resident-related API calls
 * Manages CRUD operations for residents and their parking allocations
 */

import { get, post, put, patch, del, buildQueryString } from '@/utils/fetcher';

const BASE_URL = '/api/residents';

/**
 * Get all residents with optional filters and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.search - Search term for name/email
 * @param {string} params.building - Filter by building
 * @param {boolean} params.hasParking - Filter by parking allocation status
 * @returns {Promise<{residents: Array, total: number, page: number, totalPages: number}>}
 */
export async function getAllResidents(params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}${queryString}`);
}

/**
 * Get a single resident by ID
 * @param {string|number} id - Resident ID
 * @returns {Promise<Object>} Resident data with parking allocation details
 */
export async function getResidentById(id) {
    return get(`${BASE_URL}/${id}`);
}

/**
 * Create a new resident
 * @param {Object} residentData - Resident information
 * @param {string} residentData.name - Full name
 * @param {string} residentData.email - Email address
 * @param {string} residentData.phone - Phone number
 * @param {string} residentData.building - Building identifier
 * @param {string} residentData.apartmentNumber - Apartment/unit number
 * @param {boolean} residentData.hasCar - Whether resident owns a car
 * @returns {Promise<Object>} Created resident
 */
export async function createResident(residentData) {
    return post(BASE_URL, residentData);
}

/**
 * Update an existing resident (full update)
 * @param {string|number} id - Resident ID
 * @param {Object} residentData - Updated resident information
 * @returns {Promise<Object>} Updated resident
 */
export async function updateResident(id, residentData) {
    return put(`${BASE_URL}/${id}`, residentData);
}

/**
 * Partially update a resident
 * @param {string|number} id - Resident ID
 * @param {Object} updates - Partial updates to apply
 * @returns {Promise<Object>} Updated resident
 */
export async function patchResident(id, updates) {
    return patch(`${BASE_URL}/${id}`, updates);
}

/**
 * Delete a resident
 * @param {string|number} id - Resident ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function deleteResident(id) {
    return del(`${BASE_URL}/${id}`);
}

/**
 * Get parking allocation history for a resident
 * @param {string|number} id - Resident ID
 * @returns {Promise<Array>} Array of parking allocations
 */
export async function getResidentParkingHistory(id) {
    return get(`${BASE_URL}/${id}/parking-history`);
}

/**
 * Register a resident for the next raffle
 * @param {string|number} id - Resident ID
 * @param {Object} registrationData - Registration preferences (optional)
 * @returns {Promise<Object>} Registration confirmation
 */
export async function registerForRaffle(id, registrationData = {}) {
    return post(`${BASE_URL}/${id}/raffle-registration`, registrationData);
}

/**
 * Unregister a resident from the current raffle
 * @param {string|number} id - Resident ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function unregisterFromRaffle(id) {
    return del(`${BASE_URL}/${id}/raffle-registration`);
}

/**
 * Get residents eligible for raffle
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Array of eligible residents
 */
export async function getEligibleResidents(params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}/eligible${queryString}`);
}

/**
 * Bulk import residents
 * @param {Array<Object>} residents - Array of resident data
 * @returns {Promise<{imported: number, failed: number, errors: Array}>}
 */
export async function bulkImportResidents(residents) {
    return post(`${BASE_URL}/bulk-import`, { residents });
}

/**
 * Export residents data
 * @param {Object} params - Filter parameters for export
 * @returns {Promise<Blob>} CSV or Excel file blob
 */
export async function exportResidents(params = {}) {
    const queryString = buildQueryString({ ...params, format: 'csv' });
    return get(`${BASE_URL}/export${queryString}`);
}
