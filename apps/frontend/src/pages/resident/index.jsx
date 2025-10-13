// import { useEffect, useMemo, useState } from 'react';
// import Layout from '@/components/Layout/Layout';
// import Sidebar from '@/components/Sidebar/Sidebar';
// import Topbar from '@/components/Topbar/Topbar';
// import Banner from '@/components/Banner/Banner';
// import Card from '@/components/Card/Card';
// import Button from '@/components/Button/Button';
// import Countdown from '@/components/Countdown/Countdown';
// import { getState, listRaffles, getNextRaffleAt } from '@/lib/db';
// import { formatDate } from '@/lib/date';
// import Link from 'next/link';

// export default function ResidentDashboard() {
//     const [state, setState] = useState(getState());
//     useEffect(() => {
//         setState(getState());
//     }, []);

//     const user = state.currentUser;
//     const allocations = state.allocations.filter(
//         (a) => a.residentId === user?.id,
//     );
//     const current = allocations[allocations.length - 1];
//     const nextRaffle = getNextRaffleAt();

//     const status = useMemo(() => {
//         if (!current) return 'none';
//         return 'assigned';
//     }, [current]);

//     return (
//         <Layout
//             sidebar={
//                 <Sidebar
//                     current="/resident"
//                     items={[
//                         { href: '/resident', label: 'Dashboard', icon: '🏠' },
//                         {
//                             href: '/resident/raffle',
//                             label: 'Join Raffle',
//                             icon: '🎟️',
//                         },
//                         {
//                             href: '/resident/profile',
//                             label: 'Profile',
//                             icon: '👤',
//                         },
//                     ]}
//                 />
//             }
//         >
//             <Topbar title={`Welcome, ${user?.name || 'Resident'}`} />

//             <div className="grid cols-2">
//                 <Banner
//                     title={`Next Raffle: ${formatDate(nextRaffle)}`}
//                     subtitle={
//                         <span>
//                             Time remaining: <Countdown to={nextRaffle} />
//                         </span>
//                     }
//                     badge="Raffle"
//                 />
//                 <Card title="My Parking Status">
//                     {status === 'none' && (
//                         <div>
//                             <p>You don’t have an assigned spot yet.</p>
//                             <Link href="/resident/raffle">
//                                 <Button variant="primary">
//                                     Join Next Raffle
//                                 </Button>
//                             </Link>
//                         </div>
//                     )}
//                     {status === 'assigned' && (
//                         <div>
//                             <p>
//                                 <strong>
//                                     Assigned to Spot {current.spotId}
//                                 </strong>{' '}
//                                 — Valid until {formatDate(current.validUntil)}
//                             </p>
//                             <p className="muted">
//                                 Building inferred from Spot ID.
//                             </p>
//                         </div>
//                     )}
//                 </Card>
//             </div>

//             <div className="grid cols-2" style={{ marginTop: 16 }}>
//                 <Card title="Latest Raffles" subtitle="History">
//                     {listRaffles()
//                         .slice(-3)
//                         .reverse()
//                         .map((r) => (
//                             <div
//                                 key={r.id}
//                                 style={{
//                                     display: 'flex',
//                                     justifyContent: 'space-between',
//                                     padding: '8px 0',
//                                     borderBottom: '1px solid #edf1f5',
//                                 }}
//                             >
//                                 <span>{formatDate(r.date)}</span>
//                                 <span className="muted">
//                                     Assignments: {r.assignments.length}
//                                 </span>
//                             </div>
//                         ))}
//                 </Card>
//                 <Card title="Navigation">
//                     <div className="grid">
//                         <Link href="/resident/raffle">
//                             <Button variant="secondary">Join the Raffle</Button>
//                         </Link>
//                         <Link href="/resident">
//                             <Button variant="ghost">Dashboard</Button>
//                         </Link>
//                     </div>
//                 </Card>
//             </div>
//         </Layout>
//     );
// }
