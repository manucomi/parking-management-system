/**
 * @jest-environment jsdom
 */

import * as ResidentService from './ResidentService';
import * as fetcher from '@/utils/fetcher';

jest.mock('@/utils/fetcher', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
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

describe('ResidentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllResidents', () => {
        it('should fetch all residents', async () => {
            const mockResponse = {
                residents: [{ id: 1, name: 'John Doe' }],
                total: 1,
            };
            fetcher.get.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.getAllResidents();

            expect(fetcher.get).toHaveBeenCalledWith('/api/residents');
            expect(result).toEqual(mockResponse);
        });

        it('should fetch residents with params', async () => {
            const mockResponse = { residents: [] };
            fetcher.get.mockResolvedValueOnce(mockResponse);

            await ResidentService.getAllResidents({ search: 'john' });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/residents?search=john',
            );
        });
    });

    describe('getResidentById', () => {
        it('should fetch a resident by ID', async () => {
            const mockResident = { id: 1, name: 'John Doe' };
            fetcher.get.mockResolvedValueOnce(mockResident);

            const result = await ResidentService.getResidentById(1);

            expect(fetcher.get).toHaveBeenCalledWith('/api/residents/1');
            expect(result).toEqual(mockResident);
        });
    });

    describe('createResident', () => {
        it('should create a new resident', async () => {
            const newResident = { name: 'John Doe', email: 'john@example.com' };
            const mockResponse = { id: 1, ...newResident };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.createResident(newResident);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/residents',
                newResident,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('updateResident', () => {
        it('should update a resident', async () => {
            const updates = { name: 'Updated Name' };
            const mockResponse = { id: 1, ...updates };
            fetcher.put.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.updateResident(1, updates);

            expect(fetcher.put).toHaveBeenCalledWith(
                '/api/residents/1',
                updates,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('deleteResident', () => {
        it('should delete a resident', async () => {
            const mockResponse = { success: true };
            fetcher.del.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.deleteResident(1);

            expect(fetcher.del).toHaveBeenCalledWith('/api/residents/1');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('registerForRaffle', () => {
        it('should register a resident for raffle', async () => {
            const mockResponse = { success: true };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.registerForRaffle(1);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/residents/1/raffle-registration',
                {},
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('unregisterFromRaffle', () => {
        it('should unregister a resident from raffle', async () => {
            const mockResponse = { success: true };
            fetcher.del.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.unregisterFromRaffle(1);

            expect(fetcher.del).toHaveBeenCalledWith(
                '/api/residents/1/raffle-registration',
            );
            expect(result).toEqual(mockResponse);
        });
    });
});
