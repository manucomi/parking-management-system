/**
 * @jest-environment jsdom
 */

import * as ParkingSpotService from './ParkingSpotService';
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

describe('ParkingSpotService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllSpots', () => {
        it('should fetch all spots with default params', async () => {
            const mockResponse = {
                spots: [{ id: 'A-101', building: 'A' }],
                total: 1,
                page: 1,
                totalPages: 1,
            };
            fetcher.get.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.getAllSpots();

            expect(fetcher.get).toHaveBeenCalledWith('/api/parking-spots');
            expect(result).toEqual(mockResponse);
        });

        it('should fetch spots with filter params', async () => {
            const mockResponse = { spots: [] };
            fetcher.get.mockResolvedValueOnce(mockResponse);

            await ParkingSpotService.getAllSpots({
                page: 2,
                building: 'A',
                level: '1',
                status: 'available',
                type: 'electric',
            });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/parking-spots?page=2&building=A&level=1&status=available&type=electric',
            );
        });
    });

    describe('getSpotById', () => {
        it('should fetch a spot by ID', async () => {
            const mockSpot = { id: 'A-101', building: 'A', available: true };
            fetcher.get.mockResolvedValueOnce(mockSpot);

            const result = await ParkingSpotService.getSpotById('A-101');

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/parking-spots/A-101',
            );
            expect(result).toEqual(mockSpot);
        });
    });

    describe('getAvailableSpots', () => {
        it('should fetch available spots', async () => {
            const mockSpots = [{ id: 'A-101' }, { id: 'A-102' }];
            fetcher.get.mockResolvedValueOnce(mockSpots);

            const result = await ParkingSpotService.getAvailableSpots();

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/parking-spots/available',
            );
            expect(result).toEqual(mockSpots);
        });

        it('should fetch available spots with params', async () => {
            fetcher.get.mockResolvedValueOnce([]);

            await ParkingSpotService.getAvailableSpots({
                building: 'B',
                type: 'compact',
            });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/parking-spots/available?building=B&type=compact',
            );
        });
    });

    describe('createSpot', () => {
        it('should create a new spot', async () => {
            const spotData = {
                number: '101',
                building: 'A',
                level: '1',
                type: 'regular',
            };
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

    describe('updateSpot', () => {
        it('should update a spot', async () => {
            const updates = { type: 'handicap' };
            const mockResponse = { id: 'A-101', ...updates };
            fetcher.put.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.updateSpot(
                'A-101',
                updates,
            );

            expect(fetcher.put).toHaveBeenCalledWith(
                '/api/parking-spots/A-101',
                updates,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('patchSpot', () => {
        it('should partially update a spot', async () => {
            const updates = { location: 'Near elevator' };
            const mockResponse = { id: 'A-101', ...updates };
            fetcher.patch.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.patchSpot('A-101', updates);

            expect(fetcher.patch).toHaveBeenCalledWith(
                '/api/parking-spots/A-101',
                updates,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('deleteSpot', () => {
        it('should delete a spot', async () => {
            const mockResponse = { success: true, message: 'Deleted' };
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
            const assignmentData = {
                residentId: 1,
                startDate: '2025-01-01',
                endDate: '2025-12-31',
                notes: 'Raffle winner',
            };
            const mockResponse = { success: true, allocation: {} };
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
        it('should release a spot with default data', async () => {
            const mockResponse = { success: true, message: 'Released' };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.releaseSpot('A-101');

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/parking-spots/A-101/release',
                {},
            );
            expect(result).toEqual(mockResponse);
        });

        it('should release a spot with custom data', async () => {
            const releaseData = {
                reason: 'Resident moved out',
                effectiveDate: '2025-06-30',
            };
            const mockResponse = { success: true };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            await ParkingSpotService.releaseSpot('A-101', releaseData);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/parking-spots/A-101/release',
                releaseData,
            );
        });
    });

    describe('reserveSpot', () => {
        it('should reserve a spot', async () => {
            const reservationData = {
                residentId: 1,
                startDate: '2025-01-01',
                endDate: '2025-01-07',
                reason: 'Temporary assignment',
            };
            const mockResponse = { success: true, reservation: {} };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.reserveSpot(
                'A-101',
                reservationData,
            );

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/parking-spots/A-101/reserve',
                reservationData,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getSpotHistory', () => {
        it('should fetch spot history', async () => {
            const mockHistory = [
                { id: 'h1', residentId: 1, startDate: '2025-01-01' },
            ];
            fetcher.get.mockResolvedValueOnce(mockHistory);

            const result = await ParkingSpotService.getSpotHistory('A-101');

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/parking-spots/A-101/history',
            );
            expect(result).toEqual(mockHistory);
        });
    });

    describe('markSpotMaintenance', () => {
        it('should mark a spot as under maintenance', async () => {
            const maintenanceData = {
                startDate: '2025-01-20',
                endDate: '2025-01-25',
                reason: 'Repainting',
            };
            const mockResponse = { id: 'A-101', status: 'maintenance' };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.markSpotMaintenance(
                'A-101',
                maintenanceData,
            );

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/parking-spots/A-101/maintenance',
                maintenanceData,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('completeSpotMaintenance', () => {
        it('should complete maintenance for a spot', async () => {
            const mockResponse = { id: 'A-101', status: 'available' };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result =
                await ParkingSpotService.completeSpotMaintenance('A-101');

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/parking-spots/A-101/maintenance/complete',
                {},
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getSpotStats', () => {
        it('should fetch spot statistics', async () => {
            const mockStats = {
                total: 100,
                available: 50,
                occupied: 45,
                maintenance: 5,
            };
            fetcher.get.mockResolvedValueOnce(mockStats);

            const result = await ParkingSpotService.getSpotStats();

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/parking-spots/stats',
            );
            expect(result).toEqual(mockStats);
        });

        it('should fetch stats with params', async () => {
            fetcher.get.mockResolvedValueOnce({});

            await ParkingSpotService.getSpotStats({ building: 'A' });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/parking-spots/stats?building=A',
            );
        });
    });

    describe('bulkImportSpots', () => {
        it('should bulk import spots', async () => {
            const spots = [
                { number: '101', building: 'A', level: '1' },
                { number: '102', building: 'A', level: '1' },
            ];
            const mockResponse = { imported: 2, failed: 0, errors: [] };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.bulkImportSpots(spots);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/parking-spots/bulk-import',
                {
                    spots,
                },
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('exportSpots', () => {
        it('should export spots', async () => {
            const mockBlob = new Blob(['csv data']);
            fetcher.get.mockResolvedValueOnce(mockBlob);

            const result = await ParkingSpotService.exportSpots();

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/parking-spots/export?format=csv',
            );
            expect(result).toEqual(mockBlob);
        });

        it('should export with params', async () => {
            const mockBlob = new Blob();
            fetcher.get.mockResolvedValueOnce(mockBlob);

            await ParkingSpotService.exportSpots({
                building: 'A',
                status: 'available',
            });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/parking-spots/export?building=A&status=available&format=csv',
            );
        });
    });

    describe('swapSpotAssignments', () => {
        it('should swap two spot assignments', async () => {
            const mockResponse = {
                success: true,
                message: 'Swapped successfully',
            };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ParkingSpotService.swapSpotAssignments(
                'A-101',
                'B-202',
                'Resident request',
            );

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/parking-spots/swap',
                {
                    spot1Id: 'A-101',
                    spot2Id: 'B-202',
                    reason: 'Resident request',
                },
            );
            expect(result).toEqual(mockResponse);
        });
    });
});
