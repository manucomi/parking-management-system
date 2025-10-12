/**
 * @jest-environment jsdom
 */

import * as ResidentService from './ResidentService';
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

describe('ResidentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllResidents', () => {
        it('should fetch all residents with default params', async () => {
            const mockResponse = {
                residents: [{ id: 1, name: 'John Doe' }],
                total: 1,
                page: 1,
                totalPages: 1,
            };
            fetcher.get.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.getAllResidents();

            expect(fetcher.get).toHaveBeenCalledWith('/api/residents');
            expect(result).toEqual(mockResponse);
        });

        it('should fetch residents with pagination params', async () => {
            const mockResponse = { residents: [], total: 0 };
            fetcher.get.mockResolvedValueOnce(mockResponse);

            await ResidentService.getAllResidents({ page: 2, limit: 20 });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/residents?page=2&limit=20',
            );
        });

        it('should fetch residents with filter params', async () => {
            const mockResponse = { residents: [] };
            fetcher.get.mockResolvedValueOnce(mockResponse);

            await ResidentService.getAllResidents({
                search: 'john',
                building: 'A',
                hasParking: true,
            });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/residents?search=john&building=A&hasParking=true',
            );
        });
    });

    describe('getResidentById', () => {
        it('should fetch a single resident by ID', async () => {
            const mockResident = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
            };
            fetcher.get.mockResolvedValueOnce(mockResident);

            const result = await ResidentService.getResidentById(1);

            expect(fetcher.get).toHaveBeenCalledWith('/api/residents/1');
            expect(result).toEqual(mockResident);
        });

        it('should handle string IDs', async () => {
            const mockResident = { id: 'abc-123', name: 'Jane Doe' };
            fetcher.get.mockResolvedValueOnce(mockResident);

            await ResidentService.getResidentById('abc-123');

            expect(fetcher.get).toHaveBeenCalledWith('/api/residents/abc-123');
        });
    });

    describe('createResident', () => {
        it('should create a new resident', async () => {
            const newResident = {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                building: 'A',
                apartmentNumber: '101',
                hasCar: true,
            };
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
        it('should update a resident with full data', async () => {
            const updates = {
                name: 'Updated Name',
                email: 'updated@example.com',
            };
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

    describe('patchResident', () => {
        it('should partially update a resident', async () => {
            const updates = { phone: '+9876543210' };
            const mockResponse = { id: 1, phone: '+9876543210' };
            fetcher.patch.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.patchResident(1, updates);

            expect(fetcher.patch).toHaveBeenCalledWith(
                '/api/residents/1',
                updates,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('deleteResident', () => {
        it('should delete a resident', async () => {
            const mockResponse = { success: true, message: 'Resident deleted' };
            fetcher.del.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.deleteResident(1);

            expect(fetcher.del).toHaveBeenCalledWith('/api/residents/1');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getResidentParkingHistory', () => {
        it('should fetch parking history for a resident', async () => {
            const mockHistory = [
                { id: 'h1', spotId: 'A-101', startDate: '2025-01-01' },
            ];
            fetcher.get.mockResolvedValueOnce(mockHistory);

            const result = await ResidentService.getResidentParkingHistory(1);

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/residents/1/parking-history',
            );
            expect(result).toEqual(mockHistory);
        });
    });

    describe('registerForRaffle', () => {
        it('should register a resident for raffle without data', async () => {
            const mockResponse = { success: true, message: 'Registered' };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.registerForRaffle(1);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/residents/1/raffle-registration',
                {},
            );
            expect(result).toEqual(mockResponse);
        });

        it('should register a resident for raffle with preferences', async () => {
            const preferences = { preferredBuilding: 'A' };
            const mockResponse = { success: true };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            await ResidentService.registerForRaffle(1, preferences);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/residents/1/raffle-registration',
                preferences,
            );
        });
    });

    describe('unregisterFromRaffle', () => {
        it('should unregister a resident from raffle', async () => {
            const mockResponse = { success: true, message: 'Unregistered' };
            fetcher.del.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.unregisterFromRaffle(1);

            expect(fetcher.del).toHaveBeenCalledWith(
                '/api/residents/1/raffle-registration',
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getEligibleResidents', () => {
        it('should fetch eligible residents', async () => {
            const mockResidents = [{ id: 1, name: 'John' }];
            fetcher.get.mockResolvedValueOnce(mockResidents);

            const result = await ResidentService.getEligibleResidents();

            expect(fetcher.get).toHaveBeenCalledWith('/api/residents/eligible');
            expect(result).toEqual(mockResidents);
        });

        it('should fetch eligible residents with params', async () => {
            fetcher.get.mockResolvedValueOnce([]);

            await ResidentService.getEligibleResidents({ building: 'A' });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/residents/eligible?building=A',
            );
        });
    });

    describe('bulkImportResidents', () => {
        it('should bulk import residents', async () => {
            const residents = [
                { name: 'John', email: 'john@example.com' },
                { name: 'Jane', email: 'jane@example.com' },
            ];
            const mockResponse = { imported: 2, failed: 0, errors: [] };
            fetcher.post.mockResolvedValueOnce(mockResponse);

            const result = await ResidentService.bulkImportResidents(residents);

            expect(fetcher.post).toHaveBeenCalledWith(
                '/api/residents/bulk-import',
                {
                    residents,
                },
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('exportResidents', () => {
        it('should export residents with default format', async () => {
            const mockBlob = new Blob(['csv data']);
            fetcher.get.mockResolvedValueOnce(mockBlob);

            const result = await ResidentService.exportResidents();

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/residents/export?format=csv',
            );
            expect(result).toEqual(mockBlob);
        });

        it('should export residents with custom params', async () => {
            const mockBlob = new Blob();
            fetcher.get.mockResolvedValueOnce(mockBlob);

            await ResidentService.exportResidents({
                building: 'A',
                hasParking: true,
            });

            expect(fetcher.get).toHaveBeenCalledWith(
                '/api/residents/export?building=A&hasParking=true&format=csv',
            );
        });
    });
});
