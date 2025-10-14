import { createClient } from '@/utils/supabase/server';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import styles from './index.module.scss';

function ResidentDashboard({ user }) {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        // Redirect to home page after logout
        router.push('/');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Resident Dashboard</h1>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                </button>
            </header>

            <main className={styles.main}>
                <div className={styles.welcome}>
                    <h2>
                        Welcome, {user?.user_metadata?.full_name || user?.email}
                        !
                    </h2>
                    <p>This is your resident dashboard.</p>
                </div>

                <div className={styles.sections}>
                    <section className={styles.card}>
                        <h3>My Parking Information</h3>
                        <p>View your parking spot assignment and details.</p>
                        <p className={styles['coming-soon']}>Coming soon...</p>
                    </section>

                    <section className={styles.card}>
                        <h3>Raffle Registration</h3>
                        <p>Register for upcoming parking spot raffles.</p>
                        <p className={styles['coming-soon']}>Coming soon...</p>
                    </section>

                    <section className={styles.card}>
                        <h3>My Profile</h3>
                        <p>Update your contact information and preferences.</p>
                        <p className={styles['coming-soon']}>Coming soon...</p>
                    </section>
                </div>
            </main>
        </div>
    );
}

// Protect resident dashboard with authentication
export async function getServerSideProps(context) {
    // Create Supabase server client with cookie handling
    const supabase = createClient(context);

    // Get authenticated user from Supabase (reads from cookies)
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    console.log('[Resident Dashboard] User authenticated:', !!user);
    if (authError) {
        console.error('[Resident Dashboard] Auth error:', authError);
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
        props: {
            user: {
                id: user.id,
                email: user.email,
                user_metadata: user.user_metadata || {},
            },
        },
    };
}

export default ResidentDashboard;
