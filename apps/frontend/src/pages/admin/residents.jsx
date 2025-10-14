import withAdminLayout from '@/components/Layout/withAdminLayout';
import Table from '@/components/Table/Table';
import SearchBar from '@/components/SearchBar/SearchBar';
import Pagination from '@/components/Pagination/Pagination';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import { withAuth } from '@/components/withAuth';
import styles from './residents.module.scss';
import { useMemo, useState } from 'react';
import NetworkFirstCacheService from '@/utils/NetworkFirstCacheService/NetworkFirstCacheService';
import { createClient } from '@/utils/supabase/server';

// Server-side cache service
const cacheService = new NetworkFirstCacheService({
    timeout: 3000,
    logCacheOperations: true,
});

function ResidentsPage({ residents: initialResidents, error: serverError }) {
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [residents, setResidents] = useState(initialResidents || []);

    const filtered = useMemo(
        () =>
            residents.filter(
                (r) =>
                    !q ||
                    r.name.toLowerCase().includes(q.toLowerCase()) ||
                    r.email.toLowerCase().includes(q.toLowerCase()),
            ),
        [q, residents],
    );

    const pageSize = 8;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

    // Transform data to match table format
    const tableData = pageRows.map((r) => ({
        name: r.name,
        email: r.email,
        building: r.building || 'N/A',
        apartment: r.apartment_number || 'N/A',
        status: r.has_parking ? 'Assigned' : 'No Parking',
    }));

    return (
        <div className={styles.content}>
            <main>
                <header className={styles.header}>
                    <div>
                        <h1>Resident Management</h1>
                        <p className={styles.muted}>
                            View and manage resident information
                        </p>
                    </div>
                    <button
                        className={styles.primary}
                        onClick={() => setOpen(true)}
                    >
                        Add Resident
                    </button>
                </header>

                <SearchBar
                    placeholder="Search residents..."
                    value={q}
                    onChange={setQ}
                />

                {serverError && (
                    <div className={styles.error}>
                        Error loading residents: {serverError}
                    </div>
                )}

                <section className={styles.card}>
                    <Table
                        columns={[
                            { header: 'Name', key: 'name' },
                            { header: 'Email', key: 'email' },
                            { header: 'Building', key: 'building' },
                            { header: 'Apartment', key: 'apartment' },
                            { header: 'Parking Status', key: 'status' },
                        ]}
                        data={tableData}
                    />
                    <div className={styles.footer}>
                        <span>
                            Showing {pageRows.length} of {filtered.length}{' '}
                            residents
                        </span>
                        <Pagination
                            page={page}
                            total={totalPages}
                            onPrev={() => setPage((p) => Math.max(1, p - 1))}
                            onNext={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                        />
                    </div>
                </section>

                <ConfirmModal
                    open={open}
                    title="Add New Resident"
                    description={
                        <div className={styles['form-grid']}>
                            <label>
                                <span>Full Name</span>
                                <input placeholder="Enter full name" />
                            </label>
                            <label>
                                <span>Email Address</span>
                                <input placeholder="Enter email address" />
                            </label>
                            <label>
                                <span>Phone Number</span>
                                <input placeholder="Enter phone number" />
                            </label>
                            <label>
                                <span>Building</span>
                                <input placeholder="Enter building" />
                            </label>
                            <label>
                                <span>Apartment Number</span>
                                <input placeholder="Enter apartment number" />
                            </label>
                        </div>
                    }
                    onCancel={() => setOpen(false)}
                    onConfirm={() => setOpen(false)}
                />
            </main>
        </div>
    );
}

// SSR with auth: This runs on the server on every request
// Uses Supabase SSR client to get user session from cookies
export async function getServerSideProps(context) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    console.log('=== getServerSideProps START ===');
    console.log('API_URL:', API_URL);

    // Create Supabase server client with cookie handling
    const supabase = createClient(context);

    // Get authenticated user from Supabase (reads from cookies)
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    console.log('User authenticated:', !!user);
    if (authError) {
        console.error('Auth error:', authError);
    }

    // If not authenticated, redirect to login
    if (!user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    // Get access token from session
    const {
        data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    console.log('Access token available:', !!accessToken);

    try {
        // Use cache service to fetch residents
        const fetchResidents = async () => {
            const url = `${API_URL}/api/residents`;
            console.log('Fetching from:', url);

            // Forward auth token to API request
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error body:', errorText);
                throw new Error(
                    `HTTP error! status: ${response.status}, body: ${errorText}`,
                );
            }

            const data = await response.json();
            console.log(
                'Response data:',
                JSON.stringify(data).substring(0, 200),
            );
            return data;
        };

        // Wrap the fetch with cache (network-first strategy)
        console.log('Calling cache service...');
        const data = await cacheService.wrap('residents-list', fetchResidents);
        console.log(
            'Cache service returned, data.data length:',
            data?.data?.length,
        );

        return {
            props: {
                residents: data.data || [],
                error: null,
            },
        };
    } catch (error) {
        console.error('=== ERROR in getServerSideProps ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);

        // Return empty array on error
        return {
            props: {
                residents: [],
                error: error.message || 'Failed to load residents',
            },
        };
    } finally {
        console.log('=== getServerSideProps END ===');
    }
}

export default withAdminLayout(ResidentsPage);
