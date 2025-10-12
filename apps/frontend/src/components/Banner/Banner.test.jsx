import { render, screen } from '@testing-library/react';
import Banner from './Banner';

describe('Banner', () => {
    it('renders banner title', () => {
        render(<Banner title="Welcome to the system" />);
        expect(screen.getByText('Welcome to the system')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
        render(<Banner title="Title" subtitle="This is a subtitle" />);
        expect(screen.getByText('This is a subtitle')).toBeInTheDocument();
    });

    it('renders badge when provided', () => {
        render(<Banner title="Test" badge="New" />);
        expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders without subtitle', () => {
        render(<Banner title="Just a title" />);
        expect(screen.getByText('Just a title')).toBeInTheDocument();
    });
});
