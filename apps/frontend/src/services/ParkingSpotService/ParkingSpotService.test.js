/**
 * @jest-environment jsdom
 */

import * as ParkingSpotService from './ParkingSpotService';
import * as fetcher from '@/utils/fetcher';

jest.mock('@/utils/fetcher', () => ({
    get: jest.fn(),
    post: jest.fn(),
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

describe('ParkingSpotService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllSpots', () => {
        it('should fetch all spots', async () => {
            const mockResponse = { spots: [{ id: 'A-101' }], total: 1 };
            fetcher.get.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.getAllSpots();

            expect(fetcher.get).toHaveBeenCalledWith('/api/parking-spots');
            expect(result).toEqual(mockResponse);
        });

        it('should fetch spots with params', async () => {
            fetcher.get.mockResolvedValueOnce({ spots: [] });

            await ParkingSpotService.getAllSpots({ building: 'A' });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/parking-spots?building=A',
            );
        });
    });

    describe('getSpotById', () => {
        it('should fetch a spot by ID', async () => {
            const mockSpot = { id: 'A-101', building: 'A' };
            fetcher.get.mockResolvedValueOnce(mockSpot);

            const result = await ParkingSpotService.getSpotById('A-101');

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/parking-spots/A-101',
            );
            expect(result).toEqual(mockSpot);
        });
    });

    describe('createSpot', () => {
        it('should create a new spot', async () => {
            const spotData = { number: '101', building: 'A' };
            const mockResponse = { id: 'A-101', ...spotData };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.createSpot(spotData);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/parking-spots',
                spotData,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('deleteSpot', () => {
        it('should delete a spot', async () => {
            const mockResponse = { success: true };
            fetcher.del.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.deleteSpot('A-101');

            expect(fetcher.del).toHaveBeenCalledWith(
                '/api/parking-spots/A-101',
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('assignSpot', () => {
        it('should assign a spot to a resident', async () => {
            const assignmentData = { residentId: 1, startDate: '2025-01-01' };
            const mockResponse = { success: true };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.assignSpot(
                'A-101',
                assignmentData,
            );

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/parking-spots/A-101/assign',
                assignmentData,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('releaseSpot', () => {
        it('should release a spot', async () => {
            const mockResponse = { success: true };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.releaseSpot('A-101');

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/parking-spots/A-101/release',
                {},
            );
            expect(result).toEqual(mockResponse);
        });

        it('should release a spot with reason', async () => {
            const releaseData = { reason: 'Resident moved out' };
            fetcher.post.mockResolvedValueOnce({ success: true });

            await ParkingSpotService.releaseSpot('A-101', releaseData);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/parking-spots/A-101/release',
                releaseData,
            );
        });
    });
});
