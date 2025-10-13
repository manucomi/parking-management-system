import withAdminLayout from '@/components/Layout/withAdminLayout';
import Table from '@/components/Table/Table';
import SearchBar from '@/components/SearchBar/SearchBar';
import Pagination from '@/components/Pagination/Pagination';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import styles from './residents.module.scss';
import { useMemo, useState } from 'react';
import { useResidents } from '@/hooks/useApi';
import {
    createResident,
    deleteResident,
    updateResident,
} from '@/services/ResidentService/ResidentService';

function ResidentsPage() {
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);

    // Fetch residents from backend
    const { data: residentsData, loading, error, refetch } = useResidents();
    const residents = residentsData?.data || [];

    const filtered = useMemo(
        () =>
            residents.filter(
                (r) =>
                    !q ||
                    r.name.toLowerCase().includes(q.toLowerCase()) ||
                    r.email.toLowerCase().includes(q.toLowerCase()),
            ),
        [q, residents],
    );

    const pageSize = 8;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

    // Transform data to match table format
    const tableData = pageRows.map((r) => ({
        name: r.name,
        email: r.email,
        building: 'N/A', // Backend doesn't have building field
        apartment: r.apartment_number || 'N/A',
        status: r.has_parking ? 'Assigned' : 'No Parking',
    }));

    return (
        <div className={styles.content}>
            <main>
                <header className={styles.header}>
                    <div>
                        <h1>Resident Management</h1>
                        <p className={styles.muted}>
                            View and manage resident information
                        </p>
                    </div>
                    <button
                        className={styles.primary}
                        onClick={() => setOpen(true)}
                    >
                        Add Resident
                    </button>
                </header>
                <SearchBar
                    placeholder="Search residents..."
                    value={q}
                    onChange={setQ}
                />
                {loading && (
                    <div className={styles.loading}>Loading residents...</div>
                )}
                {error && (
                    <div className={styles.error}>
                        Error loading residents: {error}
                        <button onClick={refetch}>Retry</button>
                    </div>
                )}
                {!loading && !error && (
                    <section className={styles.card}>
                        <Table
                            columns={[
                                { header: 'Name', key: 'name' },
                                { header: 'Email', key: 'email' },
                                { header: 'Building', key: 'building' },
                                { header: 'Apartment', key: 'apartment' },
                                { header: 'Parking Status', key: 'status' },
                            ]}
                            data={tableData}
                        />
                        <div className={styles.footer}>
                            <span>
                                Showing {pageRows.length} of {filtered.length}{' '}
                                residents
                            </span>
                            <Pagination
                                page={page}
                                total={totalPages}
                                onPrev={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                onNext={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
                            />
                        </div>
                    </section>
                )}{' '}
                <ConfirmModal
                    open={open}
                    title="Add New Resident"
                    description={
                        <div className={styles['form-grid']}>
                            <label>
                                <span>Full Name</span>
                                <input placeholder="Enter full name" />
                            </label>
                            <label>
                                <span>Email Address</span>
                                <input placeholder="Enter email address" />
                            </label>
                            <label>
                                <span>Phone Number</span>
                                <input placeholder="Enter phone number" />
                            </label>
                            <label>
                                <span>Building</span>
                                <input placeholder="Enter building" />
                            </label>
                            <label>
                                <span>Apartment Number</span>
                                <input placeholder="Enter apartment number" />
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

export default withAdminLayout(ResidentsPage);
