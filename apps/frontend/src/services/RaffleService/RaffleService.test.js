/**
 * @jest-environment jsdom
 */

import * as RaffleService from './RaffleService';
import * as fetcher from '@/utils/fetcher';

jest.mock('@/utils/fetcher', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    del: jest.fn(),
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
            const mockRaffle = {
                id: 1,
                status: 'active',
                name: 'Current Raffle',
            };
            fetcher.get.mockResolvedValueOnce(mockRaffle);

            const result = await RaffleService.getCurrentRaffle();

            expect(fetcher.get).toHaveBeenCalledWith('/api/raffles/current');
            expect(result).toEqual(mockRaffle);
        });

        it('should return null when no current raffle', async () => {
            fetcher.get.mockResolvedValueOnce(null);

            const result = await RaffleService.getCurrentRaffle();

            expect(result).toBeNull();
        });
    });

    describe('getAllRaffles', () => {
        it('should fetch all raffles with default params', async () => {
            const mockResponse = {
                raffles: [{ id: 1, name: 'Raffle 1' }],
                total: 1,
                page: 1,
                totalPages: 1,
            };
            fetcher.get.mockResolvedValueOnce(mockResponse);

            const result = await RaffleService.getAllRaffles();

            expect(fetcher.get).toHaveBeenCalledWith('/api/raffles');
            expect(result).toEqual(mockResponse);
        });

        it('should fetch raffles with filter params', async () => {
            const mockResponse = { raffles: [] };
            fetcher.get.mockResolvedValueOnce(mockResponse);

            await RaffleService.getAllRaffles({
                page: 2,
                status: 'completed',
                dateFrom: '2025-01-01',
            });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/raffles?page=2&status=completed&dateFrom=2025-01-01',
            );
        });
    });

    describe('getRaffleById', () => {
        it('should fetch a raffle by ID', async () => {
            const mockRaffle = { id: 1, name: 'Test Raffle', participants: [] };
            fetcher.get.mockResolvedValueOnce(mockRaffle);

            const result = await RaffleService.getRaffleById(1);

            expect(fetcher.get).toHaveBeenCalledWith('/api/raffles/1');
            expect(result).toEqual(mockRaffle);
        });
    });

    describe('createRaffle', () => {
        it('should create a new raffle', async () => {
            const raffleData = {
                name: 'February Raffle',
                scheduledDate: '2025-02-15',
                spotsAvailable: 10,
            };
            const mockResponse = { id: 1, ...raffleData };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await RaffleService.createRaffle(raffleData);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/raffles',
                raffleData,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('updateRaffle', () => {
        it('should update a raffle', async () => {
            const updates = { spotsAvailable: 15 };
            const mockResponse = { id: 1, ...updates };
            fetcher.put.mockResolvedValueOnce(mockResponse);

            const result = await RaffleService.updateRaffle(1, updates);

            expect(fetcher.put).toHaveBeenCalledWith('/api/raffles/1', updates);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('deleteRaffle', () => {
        it('should delete a raffle', async () => {
            const mockResponse = { success: true, message: 'Deleted' };
            fetcher.del.mockResolvedValueOnce(mockResponse);

            const result = await RaffleService.deleteRaffle(1);

            expect(fetcher.del).toHaveBeenCalledWith('/api/raffles/1');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('runRaffle', () => {
        it('should run raffle with default ID and options', async () => {
            const mockResponse = {
                success: true,
                raffleId: 'raffle-123',
                winners: [],
            };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await RaffleService.runRaffle();

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/raffles/current/execute',
                {},
            );
            expect(result).toEqual(mockResponse);
        });

        it('should run raffle with custom ID and options', async () => {
            const mockResponse = { success: true, winners: [] };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            await RaffleService.runRaffle(5, {
                sendNotifications: true,
                algorithm: 'weighted',
            });

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/raffles/5/execute',
                {
                    sendNotifications: true,
                    algorithm: 'weighted',
                },
            );
        });
    });

    describe('getRaffleParticipants', () => {
        it('should fetch raffle participants', async () => {
            const mockParticipants = [{ id: 1, name: 'John' }];
            fetcher.get.mockResolvedValueOnce(mockParticipants);

            const result = await RaffleService.getRaffleParticipants(1);

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/raffles/1/participants',
            );
            expect(result).toEqual(mockParticipants);
        });

        it('should fetch participants with params', async () => {
            fetcher.get.mockResolvedValueOnce([]);

            await RaffleService.getRaffleParticipants(1, { page: 2 });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/raffles/1/participants?page=2',
            );
        });
    });

    describe('getRaffleWinners', () => {
        it('should fetch raffle winners', async () => {
            const mockWinners = [{ residentId: 1, spotId: 'A-101' }];
            fetcher.get.mockResolvedValueOnce(mockWinners);

            const result = await RaffleService.getRaffleWinners(1);

            expect(fetcher.get).toHaveBeenCalledWith('/api/raffles/1/winners');
            expect(result).toEqual(mockWinners);
        });
    });

    describe('cancelRaffle', () => {
        it('should cancel a raffle with reason', async () => {
            const mockResponse = { success: true, status: 'cancelled' };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await RaffleService.cancelRaffle(
                1,
                'Not enough participants',
            );

            expect(fetcher.post).toHaveBeenCalledWith('/api/raffles/1/cancel', {
                reason: 'Not enough participants',
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getRaffleStats', () => {
        it('should fetch raffle statistics', async () => {
            const mockStats = { totalRaffles: 10, avgParticipants: 25 };
            fetcher.get.mockResolvedValueOnce(mockStats);

            const result = await RaffleService.getRaffleStats();

            expect(fetcher.get).toHaveBeenCalledWith('/api/raffles/stats');
            expect(result).toEqual(mockStats);
        });
    });

    describe('revertRaffle', () => {
        it('should revert a raffle', async () => {
            const mockResponse = { success: true, message: 'Reverted' };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await RaffleService.revertRaffle(
                1,
                'Admin decision',
            );

            expect(fetcher.post).toHaveBeenCalledWith('/api/raffles/1/revert', {
                reason: 'Admin decision',
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('previewRaffleResults', () => {
        it('should preview raffle results', async () => {
            const mockPreview = { potentialWinners: [] };
            fetcher.post.mockResolvedValueOnce(mockPreview);

            const result = await RaffleService.previewRaffleResults(1);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/raffles/1/preview',
                {},
            );
            expect(result).toEqual(mockPreview);
        });

        it('should preview with custom options', async () => {
            const mockPreview = { potentialWinners: [] };
            fetcher.post.mockResolvedValueOnce(mockPreview);

            await RaffleService.previewRaffleResults(1, {
                algorithm: 'weighted',
            });

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/raffles/1/preview',
                {
                    algorithm: 'weighted',
                },
            );
        });
    });

    describe('sendRaffleNotifications', () => {
        it('should send raffle notifications', async () => {
            const mockResponse = { sent: 10, failed: 0 };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await RaffleService.sendRaffleNotifications(
                1,
                'results',
            );

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/raffles/1/notifications',
                {
                    type: 'results',
                },
            );
            expect(result).toEqual(mockResponse);
        });
    });
});
