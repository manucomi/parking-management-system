import styles from './Layout.module.scss';

export default function Layout({ sidebar, children }) {
    return (
        <div className={styles.shell}>
            {sidebar}
            <main className={styles.main}>{children}</main>
        </div>
    );
}
