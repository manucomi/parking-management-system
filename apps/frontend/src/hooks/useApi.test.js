/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import {
    useResidents,
    useParkingSpots,
    useCurrentRaffle,
    useMutation,
} from './useApi';
import * as ResidentService from '@/services/ResidentService/ResidentService';
import * as ParkingSpotService from '@/services/ParkingSpotService/ParkingSpotService';
import * as RaffleService from '@/services/RaffleService/RaffleService';

// Mock the services
jest.mock('@/services/ResidentService/ResidentService');
jest.mock('@/services/ParkingSpotService/ParkingSpotService');
jest.mock('@/services/RaffleService/RaffleService');

describe('useApi hooks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useResidents', () => {
        it('should fetch residents successfully', async () => {
            const mockData = {
                success: true,
                data: [
                    { id: 1, name: 'John Doe', email: 'john@example.com' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
                ],
            };

            ResidentService.getAllResidents.mockResolvedValue(mockData);

            const { result } = renderHook(() => useResidents());

            expect(result.current.loading).toBe(true);
            expect(result.current.data).toBe(null);

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data).toEqual(mockData);
            expect(result.current.error).toBe(null);
            expect(ResidentService.getAllResidents).toHaveBeenCalledTimes(1);
        });

        it('should handle errors when fetching residents', async () => {
            const errorMessage = 'Failed to fetch residents';
            ResidentService.getAllResidents.mockRejectedValue(
                new Error(errorMessage),
            );

            const { result } = renderHook(() => useResidents());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.error).toBe(errorMessage);
            expect(result.current.data).toBe(null);
        });
    });

    describe('useParkingSpots', () => {
        it('should fetch parking spots successfully', async () => {
            const mockData = {
                success: true,
                data: [
                    { id: 1, spot_number: 'A1', status: 'available' },
                    { id: 2, spot_number: 'A2', status: 'occupied' },
                ],
            };

            ParkingSpotService.getAllSpots.mockResolvedValue(mockData);

            const { result } = renderHook(() => useParkingSpots());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data).toEqual(mockData);
            expect(result.current.error).toBe(null);
        });
    });

    describe('useCurrentRaffle', () => {
        it('should fetch current raffle successfully', async () => {
            const mockData = {
                success: true,
                data: {
                    id: 1,
                    start_date: '2025-01-01',
                    end_date: '2025-01-31',
                    status: 'active',
                },
            };

            RaffleService.getCurrentRaffle.mockResolvedValue(mockData);

            const { result } = renderHook(() => useCurrentRaffle());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data).toEqual(mockData);
            expect(result.current.error).toBe(null);
        });
    });

    describe('useMutation', () => {
        it('should execute mutation successfully', async () => {
            const mockResponse = {
                success: true,
                data: { id: 1, name: 'New Resident' },
            };
            const mockMutationFn = jest.fn().mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useMutation(mockMutationFn));

            expect(result.current.loading).toBe(false);

            const mutationData = {
                name: 'New Resident',
                email: 'new@example.com',
            };

            const mutationResult = await result.current.mutate(mutationData);

            // Verify the mutation function was called correctly and returned the right value
            expect(mutationResult).toEqual(mockResponse);
            expect(mockMutationFn).toHaveBeenCalledWith(mutationData);
            expect(result.current.error).toBe(null);
        });

        it('should handle mutation errors', async () => {
            const errorMessage = 'Failed to create resident';
            const mockMutationFn = jest
                .fn()
                .mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useMutation(mockMutationFn));

            await expect(
                result.current.mutate({ name: 'Test' }),
            ).rejects.toThrow(errorMessage);

            await waitFor(() => {
                expect(result.current.error).toBe(errorMessage);
            });

            expect(result.current.data).toBe(null);
        });
    });

    describe('refetch functionality', () => {
        it('should refetch data when refetch is called', async () => {
            const mockData1 = { success: true, data: [{ id: 1 }] };
            const mockData2 = { success: true, data: [{ id: 1 }, { id: 2 }] };

            ResidentService.getAllResidents
                .mockResolvedValueOnce(mockData1)
                .mockResolvedValueOnce(mockData2);

            const { result } = renderHook(() => useResidents());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data).toEqual(mockData1);

            // Refetch
            result.current.refetch();

            await waitFor(() => {
                expect(result.current.data).toEqual(mockData2);
            });

            expect(ResidentService.getAllResidents).toHaveBeenCalledTimes(2);
        });
    });
});
