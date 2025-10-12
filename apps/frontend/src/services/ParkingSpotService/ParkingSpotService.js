/**
 * ParkingSpotService - Handles parking spot-related API calls
 */

import { get, post, del, buildQueryString } from '@/utils/fetcher';

const BASE_URL = '/api/parking-spots';

export async function getAllSpots(params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}${queryString}`);
}

export async function getSpotById(id) {
    return get(`${BASE_URL}/${id}`);
}

export async function createSpot(spotData) {
    return post(BASE_URL, spotData);
}

export async function deleteSpot(id) {
    return del(`${BASE_URL}/${id}`);
}

export async function assignSpot(spotId, assignmentData) {
    return post(`${BASE_URL}/${spotId}/assign`, assignmentData);
}

export async function releaseSpot(spotId, releaseData = {}) {
    return post(`${BASE_URL}/${spotId}/release`, releaseData);
}
