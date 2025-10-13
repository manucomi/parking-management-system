/**
 * @jest-environment jsdom
 */

import * as RaffleService from './RaffleService';
import * as fetcher from '@/utils/fetcher';

jest.mock('@/utils/fetcher', () => ({
    get: jest.fn(),
    post: jest.fn(),
    buildQueryString: jest.fn((params) => {
        if (!params || Object.keys(params).length === 0) return '';
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        return queryString ? `?${queryString}` : '';
    }),
}));

describe('RaffleService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getCurrentRaffle', () => {
        it('should fetch the current raffle', async () => {
            const mockRaffle = { id: 1, status: 'active' };
            fetcher.get.mockResolvedValueOnce(mockRaffle);

            const result = await RaffleService.getCurrentRaffle();

            expect(fetcher.get).toHaveBeenCalledWith('/api/raffle/current');
            expect(result).toEqual(mockRaffle);
        });
    });

    describe('getAllRaffles', () => {
        it('should fetch all raffles', async () => {
            const mockResponse = { raffles: [{ id: 1 }], total: 1 };
            fetcher.get.mockResolvedValueOnce(mockResponse);

            const result = await RaffleService.getAllRaffles();

            expect(fetcher.get).toHaveBeenCalledWith('/api/raffle/all');
            expect(result).toEqual(mockResponse);
        });

        it('should fetch raffles with params', async () => {
            fetcher.get.mockResolvedValueOnce({ raffles: [] });

            await RaffleService.getAllRaffles({ status: 'completed' });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/raffle/all?status=completed',
            );
        });
    });

    describe('getRaffleById', () => {
        it('should fetch a raffle by ID', async () => {
            const mockRaffle = { id: 1, name: 'Test Raffle' };
            fetcher.get.mockResolvedValueOnce(mockRaffle);

            const result = await RaffleService.getRaffleById(1);

            expect(fetcher.get).toHaveBeenCalledWith('/api/raffle/1');
            expect(result).toEqual(mockRaffle);
        });
    });

    describe('createRaffle', () => {
        it('should create a new raffle', async () => {
            const raffleData = { name: 'February Raffle' };
            const mockResponse = { id: 1, ...raffleData };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await RaffleService.createRaffle(raffleData);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/raffle',
                raffleData,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('runRaffle', () => {
        it('should run the current raffle', async () => {
            const mockResponse = { success: true, winners: [] };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await RaffleService.runRaffle();

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/raffle/run',
            );
            expect(result).toEqual(mockResponse);
        });

        it('should run raffle with custom ID', async () => {
            const mockResponse = { success: true };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            await RaffleService.runRaffle(5, { sendNotifications: true });

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/raffle/run',
            );
        });
    });

    describe('getRaffleParticipants', () => {
        it('should fetch raffle participants', async () => {
            const mockParticipants = [{ id: 1, name: 'John' }];
            fetcher.get.mockResolvedValueOnce(mockParticipants);

            const result = await RaffleService.getRaffleParticipants(1);

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/raffle/1/participants',
            );
            expect(result).toEqual(mockParticipants);
        });
    });
});
