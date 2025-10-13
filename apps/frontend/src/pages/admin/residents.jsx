import withAdminLayout from '@/components/Layout/withAdminLayout';
import Table from '@/components/Table/Table';
import SearchBar from '@/components/SearchBar/SearchBar';
import Pagination from '@/components/Pagination/Pagination';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import styles from './residents.module.scss';
import { useMemo, useState } from 'react';
import NetworkFirstCacheService from '@/utils/NetworkFirstCacheService/NetworkFirstCacheService';

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

// SSR with cache: This runs on the server on every request
export async function getServerSideProps() {
    try {
        const API_URL =
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

        // Use cache service to fetch residents
        const fetchResidents = async () => {
            const response = await fetch(`${API_URL}/api/residents`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        };

        // Wrap the fetch with cache (network-first strategy)
        const data = await cacheService.wrap('residents-list', fetchResidents);

        return {
            props: {
                residents: data.data || [],
                error: null,
            },
        };
    } catch (error) {
        console.error('Error fetching residents:', error);

        // Return empty array on error, but preserve any cached data
        return {
            props: {
                residents: [],
                error: error.message || 'Failed to load residents',
            },
        };
    }
}

export default withAdminLayout(ResidentsPage);
