/**
 * ParkingSpotService - Handles all parking spot-related API calls
 * Manages parking spot allocation, availability, and assignments
 */

import { get, post, put, patch, del, buildQueryString } from '@/utils/fetcher';

const BASE_URL = '/api/parking-spots';

/**
 * Get all parking spots with optional filters and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.building - Filter by building
 * @param {string} params.level - Filter by parking level/floor
 * @param {string} params.status - Filter by status (available, occupied, reserved, maintenance)
 * @param {string} params.type - Filter by spot type (regular, handicap, compact, electric)
 * @returns {Promise<{spots: Array, total: number, page: number, totalPages: number}>}
 */
export async function getAllSpots(params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}${queryString}`);
}

/**
 * Get a specific parking spot by ID
 * @param {string|number} id - Spot ID
 * @returns {Promise<Object>} Spot data with current assignment
 */
export async function getSpotById(id) {
    return get(`${BASE_URL}/${id}`);
}

/**
 * Get available parking spots
 * @param {Object} params - Filter parameters
 * @param {string} params.building - Filter by building
 * @param {string} params.type - Filter by spot type
 * @returns {Promise<Array>} Array of available spots
 */
export async function getAvailableSpots(params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}/available${queryString}`);
}

/**
 * Create a new parking spot
 * @param {Object} spotData - Spot information
 * @param {string} spotData.number - Spot number/identifier
 * @param {string} spotData.building - Building identifier
 * @param {string} spotData.level - Parking level/floor
 * @param {string} spotData.type - Spot type (regular, handicap, compact, electric)
 * @param {string} spotData.location - Physical location description
 * @returns {Promise<Object>} Created spot
 */
export async function createSpot(spotData) {
    return post(BASE_URL, spotData);
}

/**
 * Update a parking spot (full update)
 * @param {string|number} id - Spot ID
 * @param {Object} spotData - Updated spot information
 * @returns {Promise<Object>} Updated spot
 */
export async function updateSpot(id, spotData) {
    return put(`${BASE_URL}/${id}`, spotData);
}

/**
 * Partially update a parking spot
 * @param {string|number} id - Spot ID
 * @param {Object} updates - Partial updates to apply
 * @returns {Promise<Object>} Updated spot
 */
export async function patchSpot(id, updates) {
    return patch(`${BASE_URL}/${id}`, updates);
}

/**
 * Delete a parking spot
 * @param {string|number} id - Spot ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function deleteSpot(id) {
    return del(`${BASE_URL}/${id}`);
}

/**
 * Assign a parking spot to a resident
 * @param {string|number} spotId - Spot ID
 * @param {Object} assignmentData - Assignment details
 * @param {string|number} assignmentData.residentId - Resident ID
 * @param {Date|string} assignmentData.startDate - Assignment start date
 * @param {Date|string} assignmentData.endDate - Assignment end date
 * @param {string} assignmentData.notes - Optional notes
 * @returns {Promise<Object>} Assignment confirmation
 */
export async function assignSpot(spotId, assignmentData) {
    return post(`${BASE_URL}/${spotId}/assign`, assignmentData);
}

/**
 * Release/unassign a parking spot
 * @param {string|number} spotId - Spot ID
 * @param {Object} releaseData - Release details
 * @param {string} releaseData.reason - Reason for release
 * @param {Date|string} releaseData.effectiveDate - When the release takes effect
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function releaseSpot(spotId, releaseData = {}) {
    return post(`${BASE_URL}/${spotId}/release`, releaseData);
}

/**
 * Reserve a parking spot temporarily
 * @param {string|number} spotId - Spot ID
 * @param {Object} reservationData - Reservation details
 * @param {string|number} reservationData.residentId - Resident ID
 * @param {Date|string} reservationData.startDate - Reservation start
 * @param {Date|string} reservationData.endDate - Reservation end
 * @param {string} reservationData.reason - Reservation reason
 * @returns {Promise<Object>} Reservation confirmation
 */
export async function reserveSpot(spotId, reservationData) {
    return post(`${BASE_URL}/${spotId}/reserve`, reservationData);
}

/**
 * Get assignment history for a parking spot
 * @param {string|number} spotId - Spot ID
 * @returns {Promise<Array>} Array of past assignments
 */
export async function getSpotHistory(spotId) {
    return get(`${BASE_URL}/${spotId}/history`);
}

/**
 * Mark a spot as under maintenance
 * @param {string|number} spotId - Spot ID
 * @param {Object} maintenanceData - Maintenance details
 * @param {Date|string} maintenanceData.startDate - Maintenance start
 * @param {Date|string} maintenanceData.endDate - Expected end date
 * @param {string} maintenanceData.reason - Maintenance reason
 * @returns {Promise<Object>} Updated spot
 */
export async function markSpotMaintenance(spotId, maintenanceData) {
    return post(`${BASE_URL}/${spotId}/maintenance`, maintenanceData);
}

/**
 * Complete maintenance and make spot available
 * @param {string|number} spotId - Spot ID
 * @returns {Promise<Object>} Updated spot
 */
export async function completeSpotMaintenance(spotId) {
    return post(`${BASE_URL}/${spotId}/maintenance/complete`, {});
}

/**
 * Get parking spots statistics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Statistics (total, available, occupied, etc.)
 */
export async function getSpotStats(params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}/stats${queryString}`);
}

/**
 * Bulk import parking spots
 * @param {Array<Object>} spots - Array of spot data
 * @returns {Promise<{imported: number, failed: number, errors: Array}>}
 */
export async function bulkImportSpots(spots) {
    return post(`${BASE_URL}/bulk-import`, { spots });
}

/**
 * Export parking spots data
 * @param {Object} params - Filter parameters for export
 * @returns {Promise<Blob>} CSV or Excel file blob
 */
export async function exportSpots(params = {}) {
    const queryString = buildQueryString({ ...params, format: 'csv' });
    return get(`${BASE_URL}/export${queryString}`);
}

/**
 * Swap two parking spot assignments
 * @param {string|number} spot1Id - First spot ID
 * @param {string|number} spot2Id - Second spot ID
 * @param {string} reason - Reason for swap
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function swapSpotAssignments(spot1Id, spot2Id, reason) {
    return post(`${BASE_URL}/swap`, { spot1Id, spot2Id, reason });
}
