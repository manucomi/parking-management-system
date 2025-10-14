import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import FormInput from '@/components/FormInput/FormInput';
import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabaseClient';
import styles from './index.module.scss';

export default function Login() {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userRole, setUserRole] = useState('resident');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, login, signup } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const userMetadata = user.user_metadata || {};
            const role = userMetadata.role || 'resident';

            // Redirect based on user role
            if (role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/resident');
            }
        }
    }, [user, router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const { data, error: loginError } = await login(email, password);

            if (loginError) {
                // Handle specific error messages
                let errorMessage = loginError.message || 'Login failed';

                if (
                    errorMessage.includes('Invalid login credentials') ||
                    errorMessage.includes('invalid')
                ) {
                    errorMessage =
                        'Invalid email or password. Please check your credentials and try again.';
                } else if (errorMessage.includes('Email not confirmed')) {
                    errorMessage =
                        'Please confirm your email address before logging in.';
                } else if (errorMessage.includes('Email link is invalid')) {
                    errorMessage =
                        'Your login link has expired. Please try logging in again.';
                }

                setError(errorMessage);
                setLoading(false);
                return;
            }

            // Ensure we have valid user data before proceeding
            if (!data?.user) {
                setError(
                    'Login failed. Unable to retrieve user information. Please try again.',
                );
                setLoading(false);
                return;
            }

            // Update user metadata with selected role
            try {
                await supabase.auth.updateUser({
                    data: { role: userRole },
                });
            } catch (updateError) {
                console.error('Error updating user metadata:', updateError);
                // Don't block login if metadata update fails
            }

            // Redirect based on selected role
            if (userRole === 'admin') {
                router.push('/admin');
            } else {
                router.push('/resident');
            }
        } catch (err) {
            console.error('Unexpected login error:', err);
            setError(
                'An unexpected error occurred. Please check your credentials and try again.',
            );
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const { data, error: signupError } = await signup(email, password, {
                data: {
                    full_name: name,
                    role: 'resident', // New users are residents by default
                },
            });

            if (signupError) {
                // Handle specific error messages
                let errorMessage = signupError.message || 'Registration failed';

                if (errorMessage.includes('invalid')) {
                    errorMessage =
                        'Invalid email address. Please use a real email (e.g., yourname@gmail.com), not test@example.com';
                } else if (errorMessage.includes('already registered')) {
                    errorMessage =
                        'This email is already registered. Please login instead.';
                }

                setError(errorMessage);
                setLoading(false);
                return;
            }

            // Success - switch to login tab and show message
            setActiveTab('login');
            setEmail('');
            setPassword('');
            setName('');
            setConfirmPassword('');
            setError('');
            setLoading(false);

            // Show success message
            alert(
                'Registration successful! You can now login with your credentials.',
            );
        } catch (err) {
            console.error('Signup error:', err);
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles['header-section']}>
                    <h1 className={styles['main-title']}>
                        Parking Management System
                    </h1>
                    <p className={styles.subtitle}>
                        Manage your residential parking efficiently
                    </p>
                </div>

                <Card className={styles.card}>
                    <div className={styles.tabs}>
                        <button
                            className={classNames(styles.tab, {
                                [styles['active-tab']]: activeTab === 'login',
                            })}
                            onClick={() => setActiveTab('login')}
                        >
                            Login
                        </button>
                        <button
                            className={classNames(styles.tab, {
                                [styles['active-tab']]:
                                    activeTab === 'register',
                            })}
                            onClick={() => setActiveTab('register')}
                        >
                            Register
                        </button>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    {activeTab === 'login' ? (
                        <form onSubmit={handleLogin}>
                            <FormInput
                                type="email"
                                name="email"
                                label="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                            <FormInput
                                type="password"
                                name="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />

                            <div className={styles['role-selector']}>
                                <label className={styles['role-label']}>
                                    Login as:
                                </label>
                                <div className={styles['role-buttons']}>
                                    <button
                                        type="button"
                                        className={classNames(
                                            styles['role-button'],
                                            {
                                                [styles['role-button-active']]:
                                                    userRole === 'resident',
                                            },
                                        )}
                                        onClick={() => setUserRole('resident')}
                                    >
                                        Resident
                                    </button>
                                    <button
                                        type="button"
                                        className={classNames(
                                            styles['role-button'],
                                            {
                                                [styles['role-button-active']]:
                                                    userRole === 'admin',
                                            },
                                        )}
                                        onClick={() => setUserRole('admin')}
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div>

                            <div className={styles['login-options']}>
                                <label className={styles['remember-me']}>
                                    <FormInput type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <a
                                    href="#"
                                    className={styles['forgot-password']}
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                className={styles['submit-button']}
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister}>
                            <FormInput
                                type="text"
                                name="name"
                                label="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                            <FormInput
                                type="email"
                                name="email"
                                label="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                            <FormInput
                                type="password"
                                name="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                required
                            />
                            <FormInput
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm your password"
                                required
                            />

                            <div className={styles['register-button-wrapper']}>
                                <Button
                                    type="submit"
                                    className={styles['submit-button']}
                                    disabled={loading}
                                >
                                    {loading ? 'Registering...' : 'Register'}
                                </Button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
}
