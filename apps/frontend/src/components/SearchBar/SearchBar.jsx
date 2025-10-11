import styles from './SearchBar.module.scss';

export default function SearchBar({ placeholder, value, onChange, right }) {
    return (
        <div className={styles.bar}>
            <input
                className={styles.input}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {right}
        </div>
    );
}
