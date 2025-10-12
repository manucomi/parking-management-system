/**
 * @jest-environment jsdom
 */

import {
    fetcher,
    get,
    post,
    put,
    patch,
    del,
    buildQueryString,
    ApiError,
} from './fetcher';

describe('ApiError', () => {
    it('should create an ApiError with message, status, and data', () => {
        const error = new ApiError('Not found', 404, {
            detail: 'Resource missing',
        });

        expect(error.name).toBe('ApiError');
        expect(error.message).toBe('Not found');
        expect(error.status).toBe(404);
        expect(error.data).toEqual({ detail: 'Resource missing' });
        expect(error instanceof Error).toBe(true);
    });
});

describe('buildQueryString', () => {
    it('should return empty string for no params', () => {
        expect(buildQueryString()).toBe('');
        expect(buildQueryString({})).toBe('');
    });

    it('should build query string from params object', () => {
        const params = { page: 1, limit: 10 };
        const result = buildQueryString(params);

        expect(result).toBe('?page=1&limit=10');
    });

    it('should skip undefined and null values', () => {
        const params = {
            page: 1,
            limit: undefined,
            search: null,
            name: 'test',
        };
        const result = buildQueryString(params);

        expect(result).toBe('?page=1&name=test');
    });

    it('should handle boolean values', () => {
        const params = { active: true, deleted: false };
        const result = buildQueryString(params);

        expect(result).toBe('?active=true&deleted=false');
    });

    it('should handle special characters', () => {
        const params = { search: 'hello world', email: 'test@example.com' };
        const result = buildQueryString(params);

        expect(result).toContain('search=hello+world');
        expect(result).toContain('email=test%40example.com');
    });
});

describe('fetcher', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should make a successful GET request and parse JSON', async () => {
        const mockData = { id: 1, name: 'Test' };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            headers: {
                get: jest.fn(() => 'application/json'),
            },
            json: jest.fn().mockResolvedValueOnce(mockData),
        });

        const result = await fetcher('/api/test');

        expect(global.fetch).toHaveBeenCalledWith('/api/test', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(result).toEqual(mockData);
    });

    it('should handle text response', async () => {
        const mockText = 'Plain text response';
        global.fetch.mockResolvedValueOnce({
            ok: true,
            headers: {
                get: jest.fn(() => 'text/plain'),
            },
            text: jest.fn().mockResolvedValueOnce(mockText),
        });

        const result = await fetcher('/api/test');

        expect(result).toBe(mockText);
    });

    it('should handle custom headers', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            headers: {
                get: jest.fn(() => 'application/json'),
            },
            json: jest.fn().mockResolvedValueOnce({}),
        });

        await fetcher('/api/test', {
            headers: {
                Authorization: 'Bearer token123',
            },
        });

        expect(global.fetch).toHaveBeenCalledWith('/api/test', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer token123',
            },
        });
    });

    it('should throw ApiError on HTTP error with JSON response', async () => {
        const errorData = { message: 'Not found', error: 'Resource missing' };
        global.fetch.mockResolvedValue({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            headers: {
                get: jest.fn(() => 'application/json'),
            },
            json: jest.fn().mockResolvedValue(errorData),
        });

        try {
            await fetcher('/api/test');
            fail('Should have thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.message).toBe('Not found');
            expect(error.status).toBe(404);
            expect(error.data).toEqual(errorData);
        }
    });

    it('should throw ApiError with statusText when no error message in response', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            headers: {
                get: jest.fn(() => 'application/json'),
            },
            json: jest.fn().mockResolvedValueOnce({}),
        });

        await expect(fetcher('/api/test')).rejects.toThrow(
            'HTTP 500: Internal Server Error',
        );
    });

    it('should handle network errors', async () => {
        global.fetch.mockRejectedValue(new Error('Network error'));

        try {
            await fetcher('/api/test');
            fail('Should have thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.message).toBe('Network error');
            expect(error.status).toBe(500);
        }
    });

    it('should wrap non-ApiError errors', async () => {
        global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

        try {
            await fetcher('/api/test');
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.message).toBe('Failed to fetch');
            expect(error.status).toBe(500);
        }
    });

    it('should handle response with no content-type header', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            headers: {
                get: jest.fn(() => null),
            },
        });

        const result = await fetcher('/api/test');

        expect(result).toBeNull();
    });
});

describe('HTTP method helpers', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('get', () => {
        it('should make a GET request', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: jest.fn(() => 'application/json'),
                },
                json: jest.fn().mockResolvedValueOnce({ success: true }),
            });

            await get('/api/test');

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/test',
                expect.objectContaining({
                    method: 'GET',
                }),
            );
        });

        it('should pass additional options', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: jest.fn(() => 'application/json'),
                },
                json: jest.fn().mockResolvedValueOnce({}),
            });

            await get('/api/test', { cache: 'no-cache' });

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/test',
                expect.objectContaining({
                    method: 'GET',
                    cache: 'no-cache',
                }),
            );
        });
    });

    describe('post', () => {
        it('should make a POST request with JSON body', async () => {
            const body = { name: 'Test', value: 123 };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: jest.fn(() => 'application/json'),
                },
                json: jest.fn().mockResolvedValueOnce({ id: 1 }),
            });

            await post('/api/test', body);

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/test',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(body),
                }),
            );
        });
    });

    describe('put', () => {
        it('should make a PUT request with JSON body', async () => {
            const body = { name: 'Updated' };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: jest.fn(() => 'application/json'),
                },
                json: jest.fn().mockResolvedValueOnce({ success: true }),
            });

            await put('/api/test/1', body);

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/test/1',
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(body),
                }),
            );
        });
    });

    describe('patch', () => {
        it('should make a PATCH request with JSON body', async () => {
            const body = { status: 'active' };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: jest.fn(() => 'application/json'),
                },
                json: jest.fn().mockResolvedValueOnce({ success: true }),
            });

            await patch('/api/test/1', body);

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/test/1',
                expect.objectContaining({
                    method: 'PATCH',
                    body: JSON.stringify(body),
                }),
            );
        });
    });

    describe('del', () => {
        it('should make a DELETE request', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: jest.fn(() => 'application/json'),
                },
                json: jest.fn().mockResolvedValueOnce({ success: true }),
            });

            await del('/api/test/1');

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/test/1',
                expect.objectContaining({
                    method: 'DELETE',
                }),
            );
        });

        it('should pass additional options', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: jest.fn(() => 'application/json'),
                },
                json: jest.fn().mockResolvedValueOnce({}),
            });

            await del('/api/test/1', { headers: { 'X-Custom': 'value' } });

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/test/1',
                expect.objectContaining({
                    method: 'DELETE',
                    headers: expect.objectContaining({
                        'X-Custom': 'value',
                    }),
                }),
            );
        });
    });
});
