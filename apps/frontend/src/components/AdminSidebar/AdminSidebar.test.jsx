import { render, screen } from '@testing-library/react';
import AdminSidebar from './AdminSidebar';

// Mock next/link to render plain <a> tags for testing
jest.mock('next/link', () => {
    return ({ href, children, ...props }) => (
        <a href={href} {...props}>
            {children}
        </a>
    );
});

// Mock CSS modules (Jest usually handles this with identity-obj-proxy)
jest.mock('./AdminSidebar.module.scss', () => ({
    aside: 'aside',
    brand: 'brand',
    nav: 'nav',
    'nav-link': 'nav-link',
    active: 'active',
}));

describe('AdminSidebar', () => {
    it('renders the brand name', () => {
        render(<AdminSidebar />);
        expect(screen.getByText(/Parking System/i)).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
        render(<AdminSidebar />);
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(5);
        expect(links.map((a) => a.textContent)).toEqual([
            'Dashboard',
            'Residents',
            'Parking Spots',
            'Raffle Control',
            'Logout',
        ]);
    });

    it('applies active class to current link', () => {
        render(<AdminSidebar current="/admin/spots" />);
        const activeLink = screen.getByText('Parking Spots');
        expect(activeLink.className).toMatch(/active/);
    });

    it('does not apply active class to other links', () => {
        render(<AdminSidebar current="/admin/spots" />);
        const nonActive = screen.getByText('Dashboard');
        expect(nonActive.className).not.toMatch(/active/);
    });

    it('each link has correct href attribute', () => {
        render(<AdminSidebar />);
        expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute(
            'href',
            '/admin',
        );
        expect(screen.getByText('Residents').closest('a')).toHaveAttribute(
            'href',
            '/admin/residents',
        );
        expect(screen.getByText('Logout').closest('a')).toHaveAttribute(
            'href',
            '/logout',
        );
    });
});
