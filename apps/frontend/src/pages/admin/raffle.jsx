import withAdminLayout from '@/components/Layout/withAdminLayout';
import Table from '@/components/Table/Table';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import styles from './raffle.module.scss';
import { useState } from 'react';
import NetworkFirstCacheService from '@/utils/NetworkFirstCacheService/NetworkFirstCacheService';
import { runRaffle } from '@/services/RaffleService/RaffleService';
import { createClient } from '@/utils/supabase/server';

function RafflePage({
    currentRaffle,
    registeredResidents,
    previousRaffles,
    error: serverError,
}) {
    const [openRun, setOpenRun] = useState(false);
    const [openResults, setOpenResults] = useState(false);
    const [selectedRaffle, setSelectedRaffle] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [error, setError] = useState(serverError);

    const handleRunRaffle = async () => {
        setIsExecuting(true);
        setError(null);

        try {
            const response = await runRaffle();

            if (response.success) {
                // Reload the page to show updated data
                window.location.reload();
            } else {
                setError('Failed to run raffle');
            }
        } catch (err) {
            console.error('Error running raffle:', err);
            setError(err.message || 'Failed to run raffle');
        } finally {
            setIsExecuting(false);
            setOpenRun(false);
        }
    };

    const daysRemaining = currentRaffle?.created_at
        ? Math.max(
              0,
              Math.ceil(
                  (new Date(currentRaffle.created_at).getTime() +
                      30 * 24 * 60 * 60 * 1000 -
                      Date.now()) /
                      (1000 * 60 * 60 * 24),
              ),
          )
        : 0;

    if (error) {
        return (
            <div className={styles.content}>
                <div className={styles.error}>
                    <h2>Error loading raffle data</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Not scheduled';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}/${day}/${year}`;
    };

    const nextRaffleDate = currentRaffle?.created_at
        ? formatDate(
              new Date(
                  new Date(currentRaffle.created_at).getTime() +
                      30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
          )
        : 'Not scheduled';

    return (
        <div className={styles.content}>
            <main>
                <header className={styles.header}>
                    <div>
                        <h1>Raffle Management</h1>
                        <p className={styles.muted}>
                            Control and monitor parking spot raffles
                        </p>
                    </div>
                    <button
                        className={styles.primary}
                        onClick={() => setOpenRun(true)}
                        disabled={!currentRaffle || isExecuting}
                    >
                        {isExecuting ? 'Running...' : 'Run Raffle'}
                    </button>
                </header>

                <section className={styles.summary}>
                    <div className={styles['summary-card']}>
                        <div className={styles.kicker}>Next Raffle</div>
                        <div className={styles.big}>{nextRaffleDate}</div>
                        <div className={styles.small}>
                            {currentRaffle?.totalParticipants || 0} residents
                            have registered for this raffle
                        </div>
                        <div className={styles.small}>
                            {daysRemaining} days remaining
                        </div>
                    </div>
                    <div className={styles.note}>
                        <h3>Important Note</h3>
                        <p>
                            Running the raffle will assign spots to residents
                            and notify them automatically. This action cannot be
                            undone.
                        </p>
                        <div className={styles.actions}>
                            <button className={styles.ghost}>
                                Send Reminder to Unregistered Residents
                            </button>
                        </div>
                    </div>
                </section>

                <section className={styles.grid2}>
                    <div className={styles.card}>
                        <div className={styles['card-head']}>
                            <h3>Registered Residents</h3>
                            <span className={styles.count}>
                                {registeredResidents?.length || 0} total
                            </span>
                        </div>
                        <Table
                            columns={[
                                { header: 'Name', key: 'name' },
                                { header: 'Apartment', key: 'apartment' },
                                { header: 'Current Spot', key: 'currentSpot' },
                                {
                                    header: 'Registered Date',
                                    key: 'registeredDate',
                                },
                            ]}
                            data={registeredResidents || []}
                            renderRow={(row, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className={styles.resident}>
                                            <span className={styles.name}>
                                                {row.name}
                                            </span>
                                            <span className={styles.email}>
                                                {row.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{row.apartment}</td>
                                    <td>
                                        {row.currentSpot || (
                                            <span className={styles.none}>
                                                No spot
                                            </span>
                                        )}
                                    </td>
                                    <td>{formatDate(row.registeredDate)}</td>
                                </tr>
                            )}
                        />
                    </div>

                    <div className={styles.card}>
                        <div className={styles['card-head']}>
                            <h3>Previous Raffles</h3>
                            <span className={styles.count}>
                                {previousRaffles?.length || 0} total
                            </span>
                        </div>
                        <Table
                            columns={[
                                { header: 'Date', key: 'date' },
                                { header: 'Participants', key: 'participants' },
                                { header: 'Assigned', key: 'assigned' },
                                { header: 'Status', key: 'status' },
                                { header: '', key: 'actions' },
                            ]}
                            data={previousRaffles || []}
                            renderRow={(row, i) => (
                                <tr key={i}>
                                    <td>{formatDate(row.date)}</td>
                                    <td>{row.participants}</td>
                                    <td>
                                        <span className={styles.success}>
                                            {row.assigned}
                                        </span>
                                        /{row.participants}
                                    </td>
                                    <td>
                                        <span
                                            className={`${styles.status} ${styles[row.status.toLowerCase()]}`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={styles['view-results']}
                                            onClick={() => {
                                                setSelectedRaffle(row);
                                                setOpenResults(true);
                                            }}
                                        >
                                            View Results
                                        </button>
                                    </td>
                                </tr>
                            )}
                        />
                    </div>
                </section>

                {openRun && (
                    <ConfirmModal
                        title="Run Raffle"
                        message="Are you sure you want to run the raffle? This will assign spots to residents and cannot be undone."
                        confirmLabel="Run Raffle"
                        onConfirm={handleRunRaffle}
                        onCancel={() => setOpenRun(false)}
                    />
                )}

                {openResults && selectedRaffle && (
                    <ConfirmModal
                        title="Raffle Results"
                        message={
                            <div className={styles['results-list']}>
                                <div className={styles['results-meta']}>
                                    <div>
                                        <div className={styles.big}>
                                            {selectedRaffle.participants}
                                        </div>
                                        <div className={styles.small}>
                                            Participants
                                        </div>
                                    </div>
                                    <div>
                                        <div className={styles.big}>
                                            {selectedRaffle.assigned}
                                        </div>
                                        <div className={styles.small}>
                                            Spots Assigned
                                        </div>
                                    </div>
                                    <div>
                                        <div className={styles.big}>
                                            {Math.round(
                                                (selectedRaffle.assigned /
                                                    selectedRaffle.participants) *
                                                    100,
                                            )}
                                            %
                                        </div>
                                        <div className={styles.small}>
                                            Success Rate
                                        </div>
                                    </div>
                                </div>
                                {selectedRaffle.winners &&
                                    selectedRaffle.winners.map((w, i) => (
                                        <div key={i} className={styles.row}>
                                            <div className={styles.name}>
                                                {w.name}
                                            </div>
                                            <div className={styles.spot}>
                                                {w.spot}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        }
                        confirmLabel="Close"
                        onConfirm={() => setOpenResults(false)}
                        onCancel={() => setOpenResults(false)}
                    />
                )}
            </main>
        </div>
    );
}

export default withAdminLayout(RafflePage);

// Server-side cache service
const cacheService = new NetworkFirstCacheService({
    timeout: 3000,
    logCacheOperations: true,
});

export async function getServerSideProps(context) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    console.log('=== Raffle getServerSideProps START ===');
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

    // Helper to create auth headers
    const authHeaders = {
        Authorization: `Bearer ${accessToken}`,
    };

    try {
        // Fetch current raffle data
        const fetchCurrentRaffle = async () => {
            const url = `${API_URL}/api/raffle/current`;
            console.log('[Raffle SSR] Fetching current raffle from:', url);

            const response = await fetch(url, { headers: authHeaders });
            console.log('[Raffle SSR] Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Raffle SSR] Response error body:', errorText);
                throw new Error(
                    `HTTP error! status: ${response.status}, body: ${errorText}`,
                );
            }

            const data = await response.json();
            console.log('[Raffle SSR] Current raffle data:', data);
            return data;
        };

        const currentRaffleData = await cacheService.wrap(
            'raffle-current',
            fetchCurrentRaffle,
        );
        const currentRaffle = currentRaffleData?.data || null;

        // Fetch registered residents if there's an active raffle
        let registeredResidents = [];
        if (currentRaffle && currentRaffle.id) {
            try {
                const fetchParticipants = async () => {
                    const url = `${API_URL}/api/raffle/${currentRaffle.id}/participants`;
                    console.log(
                        '[Raffle SSR] Fetching participants from:',
                        url,
                    );

                    const response = await fetch(url, { headers: authHeaders });
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`,
                        );
                    }

                    const data = await response.json();
                    console.log(
                        '[Raffle SSR] Participants count:',
                        data?.data?.length,
                    );
                    return data;
                };

                const participantsData = await cacheService.wrap(
                    `raffle-participants-${currentRaffle.id}`,
                    fetchParticipants,
                );

                const participants = participantsData?.data || [];

                // Map backend data to frontend format
                registeredResidents = participants.map((p) => ({
                    name: p.name,
                    email: p.email,
                    apartment: p.apartment_number,
                    currentSpot: p.current_spot || null,
                    registeredDate: p.registered_at,
                }));
            } catch (participantsError) {
                console.error(
                    '[Raffle SSR] Error fetching participants:',
                    participantsError,
                );
                // Continue without participants data
            }
        }

        // Fetch all raffles for history
        const fetchAllRaffles = async () => {
            const url = `${API_URL}/api/raffle/all`;
            console.log('[Raffle SSR] Fetching all raffles from:', url);

            const response = await fetch(url, { headers: authHeaders });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('[Raffle SSR] Total raffles:', data?.data?.length);
            return data;
        };

        const allRafflesData = await cacheService.wrap(
            'raffle-all',
            fetchAllRaffles,
        );
        const allRaffles = allRafflesData?.data || [];

        // Filter and map only completed raffles for history
        const previousRaffles = allRaffles
            .filter((r) => r.status === 'completed')
            .map((r) => ({
                id: r.id,
                date: r.executed_at || r.created_at,
                participants: parseInt(r.total_participants) || 0,
                assigned: parseInt(r.total_assigned) || 0,
                status: 'Completed',
                winners: [], // Will be loaded on demand when clicking "View Results"
            }));

        console.log(
            '[Raffle SSR] Previous raffles count:',
            previousRaffles.length,
        );

        return {
            props: {
                currentRaffle,
                registeredResidents,
                previousRaffles,
                error: null,
            },
        };
    } catch (error) {
        console.error('=== ERROR in Raffle getServerSideProps ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);

        return {
            props: {
                currentRaffle: null,
                registeredResidents: [],
                previousRaffles: [],
                error: error.message || 'Failed to load raffle data',
            },
        };
    } finally {
        console.log('=== Raffle getServerSideProps END ===');
    }
}
