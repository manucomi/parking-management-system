/**
 * Custom React Hooks for API calls
 *
 * These hooks provide an easy way to fetch data from the backend
 * with loading states and error handling.
 *
 * Uses the existing service layer from src/services
 */

import { useState, useEffect } from 'react';
import * as ResidentService from '@/services/ResidentService/ResidentService';
import * as ParkingSpotService from '@/services/ParkingSpotService/ParkingSpotService';
import * as RaffleService from '@/services/RaffleService/RaffleService';

/**
 * Generic hook for data fetching
 * @param {Function} apiFunction - API function to call
 * @param {Array} dependencies - Dependencies for useEffect
 * @returns {Object} - { data, loading, error, refetch }
 */
function useApiData(apiFunction, dependencies = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return { data, loading, error, refetch: fetchData };
}

/**
 * Hook to fetch all residents
 */
export function useResidents() {
    return useApiData(ResidentService.getAllResidents);
}

/**
 * Hook to fetch a specific resident
 * @param {number} id - Resident ID
 */
export function useResident(id) {
    return useApiData(() => ResidentService.getResidentById(id), [id]);
}

/**
 * Hook to fetch all parking spots
 */
export function useParkingSpots() {
    return useApiData(ParkingSpotService.getAllSpots);
}

/**
 * Hook to fetch a specific parking spot
 * @param {number} id - Spot ID
 */
export function useParkingSpot(id) {
    return useApiData(() => ParkingSpotService.getSpotById(id), [id]);
}

/**
 * Hook to fetch current raffle
 */
export function useCurrentRaffle() {
    return useApiData(RaffleService.getCurrentRaffle);
}

/**
 * Hook for mutations (create, update, delete)
 * @param {Function} mutationFunction - API mutation function
 * @returns {Object} - { mutate, loading, error, data }
 */
export function useMutation(mutationFunction) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const mutate = async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await mutationFunction(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, loading, error, data };
}

/**
 * Example usage:
 *
 * // Fetch data
 * const { data: residents, loading, error, refetch } = useResidents();
 *
 * // Mutation
 * const { mutate: createResident, loading: creating } = useMutation(ResidentService.createResident);
 * await createResident({ name: 'John Doe', email: 'john@example.com', phone: '1234567890', apartment_number: '101' });
 * refetch(); // Refresh the list
 */
