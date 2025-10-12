import { render, screen } from '@testing-library/react';
import Table from './Table';

describe('Table', () => {
    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
    ];

    const data = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    it('renders table headers', () => {
        render(<Table columns={columns} data={data} />);
        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders table data', () => {
        render(<Table columns={columns} data={data} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('renders empty state when no data', () => {
        render(<Table columns={columns} data={[]} />);
        expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('renders status with special styling', () => {
        const columnsWithStatus = [
            { key: 'spot', header: 'Spot' },
            { key: 'status', header: 'Status' },
        ];
        const dataWithStatus = [{ spot: 'A1', status: 'Unassigned' }];
        const { container } = render(
            <Table columns={columnsWithStatus} data={dataWithStatus} />,
        );
        expect(screen.getByText('Unassigned')).toBeInTheDocument();
        expect(container.querySelector('.unassigned')).toBeInTheDocument();
    });

    it('uses custom renderRow when provided', () => {
        const renderRow = (row, i) => (
            <tr key={i}>
                <td>Custom: {row.name}</td>
            </tr>
        );
        render(<Table columns={columns} data={data} renderRow={renderRow} />);
        expect(screen.getByText('Custom: John Doe')).toBeInTheDocument();
    });

    it('renders status without special styling for assigned', () => {
        const columnsWithStatus = [
            { key: 'spot', header: 'Spot' },
            { key: 'status', header: 'Status' },
        ];
        const dataWithStatus = [{ spot: 'A1', status: 'Assigned' }];
        render(<Table columns={columnsWithStatus} data={dataWithStatus} />);
        expect(screen.getByText('Assigned')).toBeInTheDocument();
    });

    it('renders regular cells for non-status columns', () => {
        render(<Table columns={columns} data={data} />);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('uses default empty arrays when props not provided', () => {
        render(<Table />);
        expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('handles columns without key property', () => {
        const columnsNoKey = [{ header: 'Name' }, { header: 'Email' }];
        const dataForColumns = [{ Name: 'John', Email: 'john@test.com' }];
        render(<Table columns={columnsNoKey} data={dataForColumns} />);
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
    });
});
