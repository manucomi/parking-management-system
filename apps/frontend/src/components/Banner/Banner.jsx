import styles from './Banner.module.scss';

export default function Banner({ title, subtitle, badge }) {
    return (
        <div className={styles.banner}>
            <div>
                <div className={styles.kicker}>{badge}</div>
                <h2 className={styles.title}>{title}</h2>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
        </div>
    );
}
