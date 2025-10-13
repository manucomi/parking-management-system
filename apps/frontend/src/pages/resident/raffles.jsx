import Layout from '@/components/Layout/Layout';
import Sidebar from '@/components/Sidebar/Sidebar';
import Topbar from '@/components/Topbar/Topbar';
import Card from '@/components/Card/Card';
import Table from '@/components/Table/Table';

export default function Raffles() {
    const raffles = [
        { date: '2023-01-15', participants: 42, assignments: 35 },
        { date: '2022-10-01', participants: 38, assignments: 32 },
    ];

    return (
        <Layout sidebar={<Sidebar current="/admin/raffles" />}>
            <Topbar title="Previous Raffles" />
            <Card>
                <Table
                    columns={[
                        { header: 'Date', key: 'date' },
                        { header: 'Participants', key: 'participants' },
                        { header: 'Assignments', key: 'assignments' },
                    ]}
                    data={raffles}
                />
            </Card>
        </Layout>
    );
}
