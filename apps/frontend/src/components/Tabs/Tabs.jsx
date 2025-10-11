import styles from './Tabs.module.scss';

export default function Tabs({ tabs = [], active, onChange }) {
    return (
        <div className={styles.tabs}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`${styles.tab} ${active === tab ? styles.active : ''}`}
                    onClick={() => onChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
