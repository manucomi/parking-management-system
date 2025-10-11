import AdminSidebar from '@/components/AdminSidebar/AdminSidebar';
import styles from './AdminLayout.module.scss';

export default function AdminLayout({ children, current }) {
    return (
        <div className={styles.shell}>
            <AdminSidebar current={current} />
            <main className={styles.main}>{children}</main>
        </div>
    );
}
