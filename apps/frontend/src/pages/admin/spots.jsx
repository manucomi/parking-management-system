import withAdminLayout from '@/components/Layout/withAdminLayout';
import Table from '@/components/Table/Table';
import SearchBar from '@/components/SearchBar/SearchBar';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import styles from './spots.module.scss';
import { spots as ALL } from '@/data/adminDemo';
import { useMemo, useState } from 'react';

function SpotsPage() {
    const [q, setQ] = useState('');
    const [filter, setFilter] = useState('all');
    const [open, setOpen] = useState(false);

    const rows = useMemo(
        () =>
            ALL.filter(
                (sp) =>
                    (filter === 'all' ||
                        sp.status ===
                            (filter === 'assigned'
                                ? 'Assigned'
                                : filter === 'available'
                                  ? 'Available'
                                  : 'Maintenance')) &&
                    (!q ||
                        sp.spotId.toLowerCase().includes(q.toLowerCase()) ||
                        sp.building.toLowerCase().includes(q.toLowerCase())),
            ),
        [q, filter],
    );

    return (
        <div className={styles.content}>
            <main>
                <header className={styles.header}>
                    <div>
                        <h1>Parking Spot Management</h1>
                        <p className={styles.muted}>
                            View and manage parking spots
                        </p>
                    </div>
                    <div className={styles.actions}>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">Filter</option>
                            <option value="available">Available</option>
                            <option value="assigned">Assigned</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <button
                            className={styles.primary}
                            onClick={() => setOpen(true)}
                        >
                            Add Spot
                        </button>
                    </div>
                </header>

                <SearchBar
                    placeholder="Search spots..."
                    value={q}
                    onChange={setQ}
                />

                <section className={styles.card}>
                    <Table
                        columns={[
                            { header: 'Spot ID', key: 'spotId' },
                            { header: 'Building', key: 'building' },
                            { header: 'Level', key: 'level' },
                            { header: 'Status', key: 'status' },
                            { header: 'Assigned To', key: 'assignedTo' },
                        ]}
                        rows={rows}
                    />
                    <div className={styles.footer}>
                        <span>
                            Showing {rows.length} of {ALL.length} spots
                        </span>
                    </div>
                </section>

                <ConfirmModal
                    open={open}
                    title="Add New Parking Spot"
                    description={
                        <div className={styles['form-grid']}>
                            <label>
                                <span>Spot ID</span>
                                <input placeholder="Enter spot ID" />
                            </label>
                            <label>
                                <span>Building</span>
                                <input placeholder="Enter building" />
                            </label>
                            <label>
                                <span>Level</span>
                                <input placeholder="Enter level" />
                            </label>
                        </div>
                    }
                    onCancel={() => setOpen(false)}
                    onConfirm={() => setOpen(false)}
                />
            </main>
        </div>
    );
}

export default withAdminLayout(SpotsPage);
