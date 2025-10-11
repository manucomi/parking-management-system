import styles from './Modal.module.scss';
import Button from '@/components/Button/Button';

export default function Modal({ open, title, children, onClose, actions }) {
    if (!open) return null;
    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.head}>
                    <h3>{title}</h3>
                    <button className={styles.x} onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className={styles.body}>{children}</div>
                {actions && <div className={styles.footer}>{actions}</div>}
            </div>
        </div>
    );
}
