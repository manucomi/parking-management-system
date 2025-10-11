import { useState } from 'react';
import { useRouter } from 'next/router';
import FormInput from '@/components/FormInput/FormInput';
import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import styles from './index.module.scss';

export default function Login() {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userRole, setUserRole] = useState('resident');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (userRole === 'admin') {
            router.push('/admin/');
        } else {
            router.push('/resident/');
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setActiveTab('login');
        setEmail('');
        setPassword('');
        setName('');
        setConfirmPassword('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles["header-section"]}>
                    <h1 className={styles["main-title"]}>
                        Parking Management System
                    </h1>
                    <p className={styles.subtitle}>
                        Manage your residential parking efficiently
                    </p>
                </div>

                <Card className={styles.card}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'login' ? styles["active-tab"] : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Login
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'register' ? styles["active-tab"] : ''}`}
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

                            <div className={styles["role-selector"]}>
                                <label className={styles["role-label"]}>
                                    Login as:
                                </label>
                                <div className={styles["role-buttons"]}>
                                    <button
                                        type="button"
                                        className={`${styles["role-button"]} ${userRole === 'resident' ? styles["role-button-active"] : ''}`}
                                        onClick={() => setUserRole('resident')}
                                    >
                                        Resident
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles["role-button"]} ${userRole === 'admin' ? styles["role-button-active"] : ''}`}
                                        onClick={() => setUserRole('admin')}
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div>

                            <div className={styles["login-options"]}>
                                <label className={styles["remember-me"]}>
                                    <FormInput type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#" className={styles["forgot-password"]}>
                                    Forgot Password?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                className={styles["submit-button"]}
                            >
                                Login
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

                            <div className={styles["register-button-wrapper"]}>
                                <Button
                                    type="submit"
                                    className={styles["submit-button"]}
                                >
                                    Register
                                </Button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
}
