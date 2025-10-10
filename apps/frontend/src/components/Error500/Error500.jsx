import styles from './Error500.module.scss';
import GoBackButton from '../GoBackButton/GoBackButton';

function Error500() {
    const currentSizesImage = '(max-width: 540px) 300px, 768px';

    return (
        <div className={styles.container}>
            <div className={styles['error-container']}>
                <h1 className={styles['sr-only']}>500 - Server Error</h1>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    srcSet="/resources/images/editorial_assets/misc/server-error.png 768w"
                    sizes={currentSizesImage}
                    src="/resources/images/editorial_assets/misc/server-error.png"
                    alt="Hmmmm... We can't seem to find that page."
                    className={styles['centered-image']}
                />
                <GoBackButton />
            </div>
        </div>
    );
}

export default Error500;
