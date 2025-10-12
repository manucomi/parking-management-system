import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
    it('renders with title', () => {
        render(<Card title="Test Title">Content</Card>);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders children content', () => {
        render(<Card title="Title">Test Content</Card>);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders without title', () => {
        render(<Card>Just content</Card>);
        expect(screen.getByText('Just content')).toBeInTheDocument();
    });
});
