import styles from './Pagination.module.scss';

export default function Pagination({ page = 1, total = 1, onPrev, onNext }) {
    return (
        <div className={styles.wrap}>
            <button
                onClick={onPrev}
                disabled={page <= 1}
                className={styles.btn}
            >
                Previous
            </button>
            <span>
                {' '}
                {page} / {total}{' '}
            </span>
            <button onClick={onNext} disabled={page >= total}>
                Next
            </button>
        </div>
    );
}
