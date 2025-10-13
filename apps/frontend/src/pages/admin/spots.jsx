import withAdminLayout from '@/components/Layout/withAdminLayout';
import Table from '@/components/Table/Table';
import SearchBar from '@/components/SearchBar/SearchBar';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import styles from './spots.module.scss';
import { useMemo, useState } from 'react';
import NetworkFirstCacheService from '@/utils/NetworkFirstCacheService/NetworkFirstCacheService';

// Create cache service instance
const cacheService = new NetworkFirstCacheService({
    timeout: 3000,
    logCacheOperations: true,
});

function SpotsPage({ spots: initialSpots, error: serverError }) {
    const [q, setQ] = useState('');
    const [filter, setFilter] = useState('all');
    const [open, setOpen] = useState(false);

    // Map backend data to match the expected format
    const spots = useMemo(() => {
        if (!initialSpots) return [];
        return initialSpots.map((spot) => ({
            spotId: spot.number || spot.spot_number,
            building: spot.building || 'N/A',
            level: spot.level || 'N/A',
            status:
                spot.status === 'available'
                    ? 'Available'
                    : spot.status === 'occupied'
                      ? 'Assigned'
                      : 'Maintenance',
            assignedTo: spot.assigned_to || '-',
        }));
    }, [initialSpots]);

    const rows = useMemo(
        () =>
            spots.filter(
                (sp) =>
                    (filter === 'all' ||
                        sp.status ===
                            (filter === 'assigned'
                                ? 'Assigned'
                                : filter === 'available'
                                  ? 'Available'
                                  : 'Maintenance')) &&
                    (!q ||
                        sp.spotId.toLowerCase().includes(q.toLowerCase()) ||
                        sp.building.toLowerCase().includes(q.toLowerCase())),
            ),
        [q, filter, spots],
    );

    return (
        <div className={styles.content}>
            <main>
                {serverError && (
                    <div className={styles.error}>
                        <p>Error loading spots: {serverError}</p>
                    </div>
                )}

                <header className={styles.header}>
                    <div>
                        <h1>Parking Spot Management</h1>
                        <p className={styles.muted}>
                            View and manage parking spots
                        </p>
                    </div>
                    <div className={styles.actions}>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">Filter</option>
                            <option value="available">Available</option>
                            <option value="assigned">Assigned</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <button
                            className={styles.primary}
                            onClick={() => setOpen(true)}
                        >
                            Add Spot
                        </button>
                    </div>
                </header>

                <SearchBar
                    placeholder="Search spots..."
                    value={q}
                    onChange={setQ}
                />

                <section className={styles.card}>
                    <Table
                        columns={[
                            { header: 'Spot ID', key: 'spotId' },
                            { header: 'Building', key: 'building' },
                            { header: 'Level', key: 'level' },
                            { header: 'Status', key: 'status' },
                            { header: 'Assigned To', key: 'assignedTo' },
                        ]}
                        rows={rows}
                    />
                    <div className={styles.footer}>
                        <span>
                            Showing {rows.length} of {spots.length} spots
                        </span>
                    </div>
                </section>

                <ConfirmModal
                    open={open}
                    title="Add New Parking Spot"
                    description={
                        <div className={styles['form-grid']}>
                            <label>
                                <span>Spot ID</span>
                                <input placeholder="Enter spot ID" />
                            </label>
                            <label>
                                <span>Building</span>
                                <input placeholder="Enter building" />
                            </label>
                            <label>
                                <span>Level</span>
                                <input placeholder="Enter level" />
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
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    console.log('=== getServerSideProps (spots) START ===');
    console.log('API_URL:', API_URL);

    try {
        // Use cache service to fetch spots
        const fetchSpots = async () => {
            const url = `${API_URL}/api/spots`;
            console.log('Fetching from:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error body:', errorText);
                throw new Error(
                    `HTTP error! status: ${response.status}, body: ${errorText}`,
                );
            }

            const data = await response.json();
            console.log('Response data length:', data?.data?.length);
            return data;
        };

        // Wrap the fetch with cache (network-first strategy)
        console.log('Calling cache service...');
        const data = await cacheService.wrap('spots-list', fetchSpots);
        console.log('Cache service returned, spots count:', data?.data?.length);

        return {
            props: {
                spots: data.data || [],
                error: null,
            },
        };
    } catch (error) {
        console.error('=== ERROR in getServerSideProps (spots) ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);

        // Return empty array on error, but preserve any cached data
        return {
            props: {
                spots: [],
                error: error.message || 'Failed to load spots',
            },
        };
    } finally {
        console.log('=== getServerSideProps (spots) END ===');
    }
}

export default withAdminLayout(SpotsPage);
