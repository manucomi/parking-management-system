/**
 * withAuth Higher-Order Component
 *
 * Protects pages by requiring authentication.
 * Redirects to login if user is not authenticated.
 *
 * Usage:
 * export default withAuth(YourPage);
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

/**
 * HOC to protect pages with authentication
 *
 * @param {React.Component} Component - Page component to protect
 * @returns {React.Component} Wrapped component with auth protection
 */
export function withAuth(Component) {
    return function ProtectedPage(props) {
        const router = useRouter();
        const { user, loading } = useAuth();

        useEffect(() => {
            // Redirect to login if not authenticated
            if (!loading && !user) {
                router.push('/');
            }
        }, [user, loading, router]);

        // Show loading state while checking auth
        if (loading) {
            return (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <p>Loading...</p>
                </div>
            );
        }

        // Don't render page until auth is confirmed
        if (!user) {
            return null;
        }

        // Render protected page
        return <Component {...props} />;
    };
}
