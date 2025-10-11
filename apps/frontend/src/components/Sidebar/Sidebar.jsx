import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Sidebar.module.scss';
import {
    HomeIcon,
    Users2Icon,
    CarIcon,
    TicketIcon,
    UserIcon,
    LogOutIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from 'lucide-react';

export default function Sidebar({ role = 'admin', userName = 'User' }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    const adminLinks = [
        { href: '/admin', label: 'Dashboard', icon: <HomeIcon size={20} /> },
        {
            href: '/admin/residents',
            label: 'Residents',
            icon: <Users2Icon size={20} />,
        },
        {
            href: '/admin/spots',
            label: 'Parking Spots',
            icon: <CarIcon size={20} />,
        },
        {
            href: '/admin/raffle',
            label: 'Raffle Control',
            icon: <TicketIcon size={20} />,
        },
    ];

    const residentLinks = [
        { href: '/resident', label: 'Dashboard', icon: <HomeIcon size={20} /> },
        {
            href: '/resident/spots',
            label: 'My Spots',
            icon: <CarIcon size={20} />,
        },
        {
            href: '/resident/profile',
            label: 'Profile',
            icon: <UserIcon size={20} />,
        },
    ];

    const links = role === 'admin' ? adminLinks : residentLinks;

    const handleLogout = () => {
        router.push('/');
    };

    return (
        <aside
            className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}
        >
            <div className={styles.header}>
                {!isCollapsed && (
                    <div className={styles.title}>
                        {role === 'admin' ? 'Admin Panel' : 'ParkSys'}
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`${styles["toggle-button"]} ${isCollapsed ? styles.collapsed : ''}`}
                >
                    {isCollapsed ? (
                        <ChevronRightIcon size={20} />
                    ) : (
                        <ChevronLeftIcon size={20} />
                    )}
                </button>
            </div>

            <nav className={styles.nav}>
                <ul className={styles["nav-list"]}>
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`${styles["nav-item"]} ${router.pathname === link.href ? styles.active : ''}`}
                            >
                                <span className={styles.icon}>{link.icon}</span>
                                {!isCollapsed && <span>{link.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={styles.footer}>
                {!isCollapsed && (
                    <div className={styles["user-info"]}>
                        <div className={styles.label}>Logged in as</div>
                    </div>
                )}
                <div className={styles["user-profile"]}>
                    <div className={styles.avatar}>
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    {!isCollapsed && (
                        <div className={styles.details}>
                            <div className={styles.name}>{userName}</div>
                            <div className={styles.role}>{role}</div>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className={`${styles["logout-button"]} ${isCollapsed ? styles.collapsed : ''}`}
                >
                    <LogOutIcon size={18} />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
