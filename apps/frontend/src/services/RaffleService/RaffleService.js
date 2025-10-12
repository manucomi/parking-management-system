/**
 * RaffleService - Handles raffle-related API calls
 */

import { get, post, buildQueryString } from '@/utils/fetcher';

const BASE_URL = '/api/raffles';

export async function getCurrentRaffle() {
    return get(`${BASE_URL}/current`);
}

export async function getAllRaffles(params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}${queryString}`);
}

export async function getRaffleById(id) {
    return get(`${BASE_URL}/${id}`);
}

export async function createRaffle(raffleData) {
    return post(BASE_URL, raffleData);
}

export async function runRaffle(id = 'current', options = {}) {
    return post(`${BASE_URL}/${id}/execute`, options);
}

export async function getRaffleParticipants(id, params = {}) {
    const queryString = buildQueryString(params);
    return get(`${BASE_URL}/${id}/participants${queryString}`);
}
