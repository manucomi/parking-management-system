import cx from 'classnames';
import styles from './Button.module.css';

function Button({
    children,
    variant = 'primary',
    size = 'md',
    block = false,
    disabled,
    ...props
}) {
    return (
        <button
            className={cx(
                styles.btn,
                styles[variant],
                styles[size],
                block && styles.block,
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
