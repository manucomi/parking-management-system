/**
 * ResidentService - Handles resident-related API calls
 */

import { get, post, put, del, buildQueryString } from '@/utils/fetcher';

const BASE_URL = '/api/residents';

export async function getAllResidents(params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}${queryString}`);
}

export async function getResidentById(id) {
    return get(`${BASE_URL}/${id}`);
}

export async function createResident(residentData) {
    return post(BASE_URL, residentData);
}

export async function updateResident(id, residentData) {
    return put(`${BASE_URL}/${id}`, residentData);
}

export async function deleteResident(id) {
    return del(`${BASE_URL}/${id}`);
}

export async function registerForRaffle(id) {
    return post(`${BASE_URL}/${id}/raffle-registration`, {});
}

export async function unregisterFromRaffle(id) {
    return del(`${BASE_URL}/${id}/raffle-registration`);
}
