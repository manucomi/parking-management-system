import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('applies correct default classes', () => {
        render(<Button>Default Button</Button>);
        const button = screen.getByText('Default Button');
        expect(button).toHaveClass('btn', 'primary', 'md');
    });

    it('applies variant class correctly', () => {
        render(<Button variant="secondary">Secondary Button</Button>);
        const button = screen.getByText('Secondary Button');
        expect(button).toHaveClass('secondary');
    });

    it('applies size class correctly', () => {
        render(<Button size="lg">Large Button</Button>);
        const button = screen.getByText('Large Button');
        expect(button).toHaveClass('lg');
    });

    it('applies block class when block prop is true', () => {
        render(<Button block>Block Button</Button>);
        const button = screen.getByText('Block Button');
        expect(button).toHaveClass('block');
    });

    it('disables button when disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>);
        const button = screen.getByText('Disabled Button');
        expect(button).toBeDisabled();
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Clickable Button</Button>);
        const button = screen.getByText('Clickable Button');

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
