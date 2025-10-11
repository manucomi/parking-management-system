import styles from './Card.module.scss';
export default function Card({ title, subtitle, right, className, children }) {
    return (
        <div className={`${styles.card} ${className}`}>
            {(title || right || subtitle) && (
                <div className={styles.head}>
                    <div>
                        {title && <h3 className={styles.title}>{title}</h3>}
                        {subtitle && (
                            <div className={styles.subtitle}>{subtitle}</div>
                        )}
                    </div>
                    {right && <div>{right}</div>}
                </div>
            )}
            <div className={styles.body}>{children}</div>
        </div>
    );
}
