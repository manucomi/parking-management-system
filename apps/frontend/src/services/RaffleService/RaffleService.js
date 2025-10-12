/**
 * RaffleService - Handles all raffle-related API calls
 * Manages raffle execution, history, and participant management
 */

import { get, post, put, del, buildQueryString } from '@/utils/fetcher';

const BASE_URL = '/api/raffles';

/**
 * Get the current active raffle
 * @returns {Promise<Object|null>} Current raffle data or null if none active
 */
export async function getCurrentRaffle() {
    return get(`${BASE_URL}/current`);
}

/**
 * Get all raffles with optional filters and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Filter by status (active, completed, scheduled)
 * @param {string} params.dateFrom - Start date filter
 * @param {string} params.dateTo - End date filter
 * @returns {Promise<{raffles: Array, total: number, page: number, totalPages: number}>}
 */
export async function getAllRaffles(params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}${queryString}`);
}

/**
 * Get a specific raffle by ID
 * @param {string|number} id - Raffle ID
 * @returns {Promise<Object>} Raffle data with participants and results
 */
export async function getRaffleById(id) {
    return get(`${BASE_URL}/${id}`);
}

/**
 * Create/schedule a new raffle
 * @param {Object} raffleData - Raffle configuration
 * @param {string} raffleData.name - Raffle name/description
 * @param {Date|string} raffleData.scheduledDate - When to run the raffle
 * @param {number} raffleData.spotsAvailable - Number of parking spots to allocate
 * @param {Date|string} raffleData.registrationDeadline - Last date to register
 * @param {number} raffleData.durationMonths - Duration of parking allocation
 * @returns {Promise<Object>} Created raffle
 */
export async function createRaffle(raffleData) {
    return post(BASE_URL, raffleData);
}

/**
 * Update a scheduled raffle (before execution)
 * @param {string|number} id - Raffle ID
 * @param {Object} updates - Raffle updates
 * @returns {Promise<Object>} Updated raffle
 */
export async function updateRaffle(id, updates) {
    return put(`${BASE_URL}/${id}`, updates);
}

/**
 * Delete a scheduled raffle (only if not executed)
 * @param {string|number} id - Raffle ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function deleteRaffle(id) {
    return del(`${BASE_URL}/${id}`);
}

/**
 * Execute/run a raffle
 * @param {string|number} id - Raffle ID (or 'current' for active raffle)
 * @param {Object} options - Execution options
 * @param {boolean} options.sendNotifications - Whether to send notifications to winners
 * @param {string} options.algorithm - Raffle algorithm to use (random, weighted, etc.)
 * @returns {Promise<Object>} Raffle results with winners
 */
export async function runRaffle(id = 'current', options = {}) {
    return post(`${BASE_URL}/${id}/execute`, options);
}

/**
 * Get participants for a specific raffle
 * @param {string|number} id - Raffle ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Array of participants
 */
export async function getRaffleParticipants(id, params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}/${id}/participants${queryString}`);
}

/**
 * Get winners for a specific raffle
 * @param {string|number} id - Raffle ID
 * @returns {Promise<Array>} Array of winners with assigned spots
 */
export async function getRaffleWinners(id) {
    return get(`${BASE_URL}/${id}/winners`);
}

/**
 * Cancel a raffle (mark as cancelled, different from delete)
 * @param {string|number} id - Raffle ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Cancelled raffle
 */
export async function cancelRaffle(id, reason) {
    return post(`${BASE_URL}/${id}/cancel`, { reason });
}

/**
 * Get raffle statistics
 * @returns {Promise<Object>} Statistics (total raffles, avg participants, etc.)
 */
export async function getRaffleStats() {
    return get(`${BASE_URL}/stats`);
}

/**
 * Revert/rollback a raffle (undo parking allocations)
 * @param {string|number} id - Raffle ID
 * @param {string} reason - Rollback reason
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function revertRaffle(id, reason) {
    return post(`${BASE_URL}/${id}/revert`, { reason });
}

/**
 * Preview raffle results without committing
 * @param {string|number} id - Raffle ID
 * @param {Object} options - Preview options
 * @returns {Promise<Object>} Preview of potential winners
 */
export async function previewRaffleResults(id, options = {}) {
    return post(`${BASE_URL}/${id}/preview`, options);
}

/**
 * Send notifications to raffle participants
 * @param {string|number} id - Raffle ID
 * @param {string} type - Notification type (reminder, results, etc.)
 * @returns {Promise<{sent: number, failed: number}>}
 */
export async function sendRaffleNotifications(id, type) {
    return post(`${BASE_URL}/${id}/notifications`, { type });
}
