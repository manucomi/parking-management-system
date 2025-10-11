import styles from './ConfirmModal.module.scss';

export default function ConfirmModal({
    open,
    title,
    description,
    onCancel,
    onConfirm,
}) {
    if (!open) return null;
    return (
        <div className={styles.backdrop} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.head}>
                    <h3>{title}</h3>
                </div>
                <div className={styles.body}>
                    <p>{description}</p>
                </div>
                <div className={styles.footer}>
                    <button className={styles.ghost} onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={styles.primary} onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
