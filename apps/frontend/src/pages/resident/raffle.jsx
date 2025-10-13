import { useEffect, useState } from 'react';
import Layout from '@/components/Layout/Layout';
import Sidebar from '@/components/Sidebar/Sidebar';
import Topbar from '@/components/Topbar/Topbar';
import Card from '@/components/Card/Card';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { getState, upsertResident } from '@/lib/db';

export default function ResidentRaffle() {
    const [state, setState] = useState(getState());
    const [open, setOpen] = useState(false);
    const user = state.currentUser;
    const me = state.residents.find((r) => r.id === user?.id);

    function join() {
        upsertResident({ ...me, registeredForRaffle: true });
        setState(getState());
        setOpen(true);
    }

    return (
        <Layout
            sidebar={
                <Sidebar
                    current="/resident/raffle"
                    items={[
                        { href: '/resident', label: 'Dashboard', icon: '🏠' },
                        {
                            href: '/resident/raffle',
                            label: 'Join Raffle',
                            icon: '🎟️',
                        },
                    ]}
                />
            }
        >
            <Topbar title="Join the Next Parking Raffle" />
            <Card subtitle="Raffles are run every 3 months. You’ll be notified when results are available.">
                <Button onClick={join} variant="primary" size="lg">
                    Join Raffle
                </Button>
            </Card>

            <Modal
                open={open}
                title="Registered"
                onClose={() => setOpen(false)}
                actions={
                    <Button onClick={() => setOpen(false)} variant="primary">
                        OK
                    </Button>
                }
            >
                <p>You have successfully registered for the next raffle.</p>
            </Modal>
        </Layout>
    );
}
