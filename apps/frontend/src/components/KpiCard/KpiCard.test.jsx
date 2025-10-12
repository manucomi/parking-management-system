import { render, screen } from '@testing-library/react';
import KpiCard from './KpiCard';

describe('KpiCard', () => {
    it('renders KPI label', () => {
        render(<KpiCard label="Total Users" value={150} />);
        expect(screen.getByText('Total Users')).toBeInTheDocument();
    });

    it('renders KPI value', () => {
        render(<KpiCard label="Revenue" value={25000} />);
        expect(screen.getByText('25000')).toBeInTheDocument();
    });

    it('displays trend indicator up', () => {
        render(
            <KpiCard label="Growth" value={100} trend="up" changePct={15} />,
        );
        expect(screen.getByText('↑')).toBeInTheDocument();
        expect(screen.getByText(/15%/)).toBeInTheDocument();
    });

    it('displays trend indicator down', () => {
        render(
            <KpiCard label="Decline" value={50} trend="down" changePct={-5} />,
        );
        expect(screen.getByText('↓')).toBeInTheDocument();
    });

    it('displays flat trend by default', () => {
        render(<KpiCard label="Stable" value={100} />);
        expect(screen.getByText('→')).toBeInTheDocument();
        expect(screen.getByText(/0%/)).toBeInTheDocument();
    });
});
