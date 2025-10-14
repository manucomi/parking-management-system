import '@testing-library/jest-dom';

// Mock Supabase environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON = 'test-anon-key';

// Mock Supabase client
jest.mock('@/utils/supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: jest.fn(() =>
                Promise.resolve({
                    data: { session: null },
                    error: null,
                }),
            ),
            getUser: jest.fn(() =>
                Promise.resolve({
                    data: { user: null },
                    error: null,
                }),
            ),
            signInWithPassword: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            onAuthStateChange: jest.fn(() => ({
                data: { subscription: { unsubscribe: jest.fn() } },
            })),
        },
    },
}));
