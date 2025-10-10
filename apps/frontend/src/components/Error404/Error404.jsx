import GoBackButton from '../GoBackButton/GoBackButton';

import styles from './Error404.module.scss';

function Error404() {
    const desktopImage =
        '/resources/images/editorial_assets/misc/404-hero-img_desktop.png';
    const mobileImage =
        '/resources/images/editorial_assets/misc/404-hero-img_mobile.png';
    const srcSetImage = `${mobileImage} 540w, ${desktopImage} 768w`;
    const currentSizesImage = '(max-width: 540px) 300px, 768px';
    return (
        <div className={styles.container}>
            <div className={styles['image-container']}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    srcSet={srcSetImage}
                    sizes={currentSizesImage}
                    src={desktopImage}
                    alt="Hmmmm... We can't seem to find that page."
                    className={styles['image-404']}
                />
            </div>
            <GoBackButton />
        </div>
    );
}

export default Error404;
