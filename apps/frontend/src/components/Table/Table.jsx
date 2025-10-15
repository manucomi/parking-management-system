import styles from './Table.module.scss';

export default function Table({
    columns = [],
    data = [],
    renderRow,
    isLoading = false,
    error = null,
}) {
    return (
        <div className={styles.wrap}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((c) => (
                            <th key={c.key || c.header}>{c.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className={styles.empty}
                            >
                                <div className={styles.spinner}></div>
                                Loading...
                            </td>
                        </tr>
                    ) : error && data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className={styles.error}
                            >
                                Oops! Something went wrong. Please try reloading
                                the page in a moment.
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className={styles.empty}
                            >
                                No data
                            </td>
                        </tr>
                    ) : (
                        data.map((row, i) =>
                            renderRow ? (
                                renderRow(row, i)
                            ) : (
                                <tr key={i}>
                                    {columns.map((c) => (
                                        <td key={c.key || c.header}>
                                            {c.key === 'status' &&
                                            row[c.key] === 'Unassigned' ? (
                                                <span
                                                    className={`${styles.status} ${styles.unassigned}`}
                                                >
                                                    {row[c.key]}
                                                </span>
                                            ) : (
                                                row[c.key]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ),
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}
