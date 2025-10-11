import styles from './KpiCard.module.scss';

export default function KpiCard({
    label,
    value,
    trend = 'flat',
    changePct = 0,
}) {
    return (
        <div className={styles.card}>
            <div className={styles.label}>{label}</div>
            <div className={styles.value}>{value}</div>
            <div className={`${styles.trend} ${styles[trend]}`}>
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {trend === 'flat' && '→'}
                <span>{` ${changePct}%`}</span>
            </div>
        </div>
    );
}
