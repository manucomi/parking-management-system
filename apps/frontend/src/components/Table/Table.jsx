import styles from './Table.module.scss';

export default function Table({ columns = [], data = [], renderRow }) {
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
                    {data.length === 0 ? (
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
