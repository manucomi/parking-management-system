import withAdminLayout from '@/components/Layout/withAdminLayout';
import Table from '@/components/Table/Table';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import styles from './raffle.module.scss';
import {
    nextRaffle,
    registeredResidents,
    previousRaffles,
} from '@/data/adminDemo';
import { useState } from 'react';

function RafflePage() {
    const [openRun, setOpenRun] = useState(false);
    const [openResults, setOpenResults] = useState(false);

    return (
        <div className={styles.content}>
            <main>
                <header className={styles.header}>
                    <div>
                        <h1>Raffle Management</h1>
                        <p className={styles.muted}>
                            Control and monitor parking spot raffles
                        </p>
                    </div>
                    <button
                        className={styles.primary}
                        onClick={() => setOpenRun(true)}
                    >
                        Run Raffle
                    </button>
                </header>

                <section className={styles.summary}>
                    <div className={styles["summary-card"]}>
                        <div className={styles.kicker}>Next Raffle</div>
                        <div className={styles.big}>{nextRaffle.date}</div>
                        <div className={styles.small}>
                            {nextRaffle.registeredCount} residents have
                            registered for this raffle
                        </div>
                        <div className={styles.small}>
                            {nextRaffle.daysRemaining} days remaining
                        </div>
                    </div>
                    <div className={styles.note}>
                        <h3>Important Note</h3>
                        <p>
                            Running the raffle will assign spots to residents
                            and notify them automatically. This action cannot be
                            undone.
                        </p>
                        <div className={styles.actions}>
                            <button className={styles.ghost}>
                                Send Reminder to Unregistered Residents
                            </button>
                        </div>
                    </div>
                </section>

                <section className={styles.grid2}>
                    <div className={styles.card}>
                        <div className={styles["card-head"]}>
                            <h3>Registered Residents</h3>
                            <span className={styles.count}>
                                {registeredResidents.length} total
                            </span>
                        </div>
                        <Table
                            columns={[
                                { header: 'Name', key: 'name' },
                                { header: 'Apartment', key: 'apartment' },
                                { header: 'Current Spot', key: 'currentSpot' },
                                {
                                    header: 'Registered Date',
                                    key: 'registeredDate',
                                },
                            ]}
                            data={registeredResidents}
                            renderRow={(row, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className={styles.resident}>
                                            <span className={styles.name}>
                                                {row.name}
                                            </span>
                                            <span className={styles.email}>
                                                {row.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{row.apartment}</td>
                                    <td>
                                        {row.currentSpot || (
                                            <span className={styles.none}>
                                                No spot
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {new Date(
                                            row.registeredDate,
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            )}
                        />
                    </div>

                    <div className={styles.card}>
                        <div className={styles["card-head"]}>
                            <h3>Previous Raffles</h3>
                            <span className={styles.count}>
                                {previousRaffles.length} total
                            </span>
                        </div>
                        <Table
                            columns={[
                                { header: 'Date', key: 'date' },
                                { header: 'Participants', key: 'participants' },
                                { header: 'Assigned', key: 'assigned' },
                                { header: 'Status', key: 'status' },
                                { header: '', key: 'actions' },
                            ]}
                            data={previousRaffles}
                            renderRow={(row, i) => (
                                <tr key={i}>
                                    <td>
                                        {new Date(
                                            row.date,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>{row.participants}</td>
                                    <td>
                                        <span className={styles.success}>
                                            {row.assigned}
                                        </span>
                                        /{row.participants}
                                    </td>
                                    <td>
                                        <span
                                            className={`${styles.status} ${styles[row.status.toLowerCase()]}`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={styles["view-results"]}
                                            onClick={() => setOpenResults(true)}
                                        >
                                            View Results
                                        </button>
                                    </td>
                                </tr>
                            )}
                        />
                    </div>
                </section>

                {openRun && (
                    <ConfirmModal
                        title="Run Raffle"
                        message="Are you sure you want to run the raffle? This will assign spots to residents and cannot be undone."
                        confirmLabel="Run Raffle"
                        onConfirm={() => {
                            // TODO: Implement raffle
                            setOpenRun(false);
                        }}
                        onCancel={() => setOpenRun(false)}
                    />
                )}

                {openResults && (
                    <ConfirmModal
                        title="Raffle Results"
                        message={
                            <div className={styles["results-list"]}>
                                <div className={styles["results-meta"]}>
                                    <div>
                                        <div className={styles.big}>42</div>
                                        <div className={styles.small}>
                                            Participants
                                        </div>
                                    </div>
                                    <div>
                                        <div className={styles.big}>35</div>
                                        <div className={styles.small}>
                                            Spots Assigned
                                        </div>
                                    </div>
                                    <div>
                                        <div className={styles.big}>83%</div>
                                        <div className={styles.small}>
                                            Success Rate
                                        </div>
                                    </div>
                                </div>
                                {previousRaffles[0].winners.map((w, i) => (
                                    <div key={i} className={styles.row}>
                                        <div className={styles.name}>
                                            {w.name}
                                        </div>
                                        <div className={styles.spot}>
                                            {w.spot}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                        confirmLabel="Close"
                        onConfirm={() => setOpenResults(false)}
                        onCancel={() => setOpenResults(false)}
                    />
                )}
            </main>
        </div>
    );
}

export default withAdminLayout(RafflePage);
