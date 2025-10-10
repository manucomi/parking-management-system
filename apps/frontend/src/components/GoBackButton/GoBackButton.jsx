import React from 'react';
import Button from 'mfe-core/ui/Button';
import SVGIcon from 'mfe-core/ui/SVGIcon';
import styles from './GoBackButton.module.scss';

function GoBackButton() {
    const handleClick = () => {
        window.history.back();
    };

    return (
        <Button variant={Button.variants.TEXT} onClick={handleClick}>
            <span className={styles['btn-content']}>
                <SVGIcon
                    className={styles.icon}
                    variant={SVGIcon.variants.CARET_THIN}
                />
                Go back
            </span>
        </Button>
    );
}

export default GoBackButton;
