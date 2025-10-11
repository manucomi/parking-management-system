import styles from './Button.module.scss';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    disabled = false,
    type = 'button',
    icon,
}) {
    const variantClass = styles[variant] || styles.primary;
    const sizeClass = size === 'md' ? '' : styles[size];

    return (
        <button
            type={type}
            className={`${styles.btn} ${variantClass} ${sizeClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className={styles.icon}>{icon}</span>}
            {children}
        </button>
    );
}
