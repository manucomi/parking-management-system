import { render, screen } from '@testing-library/react';
import TestComponent from './TestComponent';

describe('TestComponent', () => {
    it('renders the message', () => {
        render(<TestComponent />);
        expect(
            screen.getByText('Hello from TestComponent!'),
        ).toBeInTheDocument();
    });
});
