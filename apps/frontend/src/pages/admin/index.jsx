import KpiCard from '@/components/KpiCard/KpiCard';
import Table from '@/components/Table/Table';
import BannerRaffle from '@/components/BannerRaffle/BannerRaffle';
import withAdminLayout from '@/components/Layout/withAdminLayout';
import styles from './index.module.scss';
import {
    kpis,
    nextRaffle,
    recentAllocations,
    unassignedSpots,
} from '@/data/adminDemo';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

function AdminDashboard() {
    return (
        <div className={styles.content}>
            <header className={styles.header}>
                <h1>Admin Dashboard</h1>
                <p className={styles.muted}>
                    Overview of the parking management system
                </p>
            </header>

            <section className={styles.kpis}>
                {kpis.map((k) => (
                    <KpiCard key={k.label} {...k} />
                ))}
            </section>

            <section className={styles.banner}>
                <BannerRaffle
                    date={nextRaffle.date}
                    registeredCount={nextRaffle.registeredCount}
                    cta={
                        <Link
                            href="/admin/raffle"
                            className={styles['manage-btn']}
                        >
                            Manage Raffle
                        </Link>
                    }
                />
            </section>

            <section className={styles.tables}>
                <div className={styles.card}>
                    <div className={styles['card-head']}>
                        <h3>Recent Allocations</h3>
                    </div>
                    <Table
                        columns={[
                            { header: 'Resident', key: 'resident' },
                            { header: 'Spot ID', key: 'spotId' },
                            { header: 'Building', key: 'building' },
                            { header: 'Date Assigned', key: 'date' },
                        ]}
                        data={recentAllocations}
                    />
                    <div className={styles['card-foot']}>
                        <Link href="/admin/residents">View All Residents</Link>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles['card-head']}>
                        <h3>Unassigned Spots</h3>
                    </div>
                    <Table
                        columns={[
                            { header: 'Spot ID', key: 'spotId' },
                            { header: 'Building', key: 'building' },
                            { header: 'Level', key: 'level' },
                            { header: 'Status', key: 'status' },
                        ]}
                        data={unassignedSpots}
                    />
                    <div className={styles['card-foot']}>
                        <Link href="/admin/spots">Manage Parking Spots</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Protect admin dashboard with authentication
export async function getServerSideProps(context) {
    // Create Supabase server client with cookie handling
    const supabase = createClient(context);

    // Get authenticated user from Supabase (reads from cookies)
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    console.log('[Admin Dashboard] User authenticated:', !!user);
    if (authError) {
        console.error('[Admin Dashboard] Auth error:', authError);
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

    // User is authenticated, allow access to dashboard
    return {
        props: {},
    };
}

export default withAdminLayout(AdminDashboard);
