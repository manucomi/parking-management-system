import { render, screen } from '@testing-library/react';
import Topbar from './Topbar';

describe('Topbar', () => {
    it('renders as header element', () => {
        render(<Topbar title="Dashboard" />);
        expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders title', () => {
        render(<Topbar title="Parking Management" />);
        expect(screen.getByText('Parking Management')).toBeInTheDocument();
    });

    it('renders right content when provided', () => {
        render(<Topbar title="Test" right={<button>Logout</button>} />);
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });
});
