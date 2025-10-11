import styles from './BannerRaffle.module.scss';

export default function BannerRaffle({ date, registeredCount, cta, subtitle }) {
    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <div className={styles.kicker}>Next Raffle: {date}</div>
                <p className={styles.description}>
                    {registeredCount} residents have registered for the next
                    raffle
                </p>
            </div>
            {cta}
        </div>
    );
}
