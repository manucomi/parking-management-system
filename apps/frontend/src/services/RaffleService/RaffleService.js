/**
 * RaffleService - Handles raffle-related API calls
 */

import { get, post, buildQueryString } from '@/utils/fetcher';

const BASE_URL = '/api/raffle';

export async function getCurrentRaffle() {
    return get(`${BASE_URL}/current`);
}

export async function getAllRaffles(params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}/all${queryString}`);
}

export async function getRaffleById(id) {
    return get(`${BASE_URL}/${id}`);
}

export async function createRaffle(raffleData) {
    return post(BASE_URL, raffleData);
}

export async function runRaffle() {
    return post(`${BASE_URL}/run`);
}

export async function getRaffleParticipants(raffleId, params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}/${raffleId}/participants${queryString}`);
}

export async function getRaffleResults() {
    return get(`${BASE_URL}/results`);
}
