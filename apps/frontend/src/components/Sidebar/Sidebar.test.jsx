import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('Sidebar', () => {
    let mockPush;

    beforeEach(() => {
        mockPush = jest.fn();
        useRouter.mockReturnValue({
            pathname: '/admin',
            push: mockPush,
        });
    });

    it('renders navigation for admin', () => {
        render(<Sidebar role="admin" userName="Admin User" />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Residents')).toBeInTheDocument();
        expect(screen.getByText('Parking Spots')).toBeInTheDocument();
        expect(screen.getByText('Raffle Control')).toBeInTheDocument();
    });

    it('renders navigation for resident', () => {
        render(<Sidebar role="resident" userName="John Doe" />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('displays user name', () => {
        render(<Sidebar role="admin" userName="Test User" />);
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('shows admin panel title for admin', () => {
        render(<Sidebar role="admin" userName="Admin" />);
        expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    });

    it('shows ParkSys title for resident', () => {
        render(<Sidebar role="resident" userName="User" />);
        expect(screen.getByText('ParkSys')).toBeInTheDocument();
    });

    it('handles logout', async () => {
        const user = userEvent.setup();
        render(<Sidebar role="admin" userName="Admin" />);
        const logoutButton = screen.getByText('Logout');
        await user.click(logoutButton);
        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('toggles sidebar collapse', async () => {
        const user = userEvent.setup();
        const { container } = render(<Sidebar role="admin" userName="Admin" />);
        const toggleButton = container.querySelector('button');
        await user.click(toggleButton);
        expect(container.querySelector('.collapsed')).toBeInTheDocument();
    });

    it('uses default userName when not provided', () => {
        render(<Sidebar role="admin" />);
        expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('uses default role when not provided', () => {
        render(<Sidebar userName="Test" />);
        expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    });
});
