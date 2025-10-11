import styles from './FormInput.module.scss';

export default function FormInput({
    type = 'text',
    placeholder,
    value,
    onChange,
    label,
    name,
    error,
    required = false,
    className = '',
}) {
    return (
        <div className={styles["form-group"]}>
            {label && (
                <label htmlFor={name} className={styles.label}>
                    {label}{' '}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`${styles.input} ${error ? styles.error : ''} ${className}`}
                required={required}
            />
            {error && <p className={styles["error-text"]}>{error}</p>}
        </div>
    );
}
