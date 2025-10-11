import styles from './Topbar.module.scss';

export default function Topbar({ title, right }) {
    return (
        <header className={styles.top}>
            <h1>{title}</h1>
            <div className={styles.right}>{right}</div>
        </header>
    );
}
