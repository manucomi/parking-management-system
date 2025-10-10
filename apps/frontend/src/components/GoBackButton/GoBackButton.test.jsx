import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GoBackButton from './GoBackButton';

describe('GoBackButton', () => {
    beforeEach(() => {
        // Espiar y mockear window.history.back
        jest.spyOn(window.history, 'back').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders the "Go back" text', () => {
        render(<GoBackButton />);
        expect(screen.getByText(/go back/i)).toBeInTheDocument();
    });

    it('calls window.history.back when clicked', () => {
        render(<GoBackButton />);
        const button = screen.getByRole('button', { name: /go back/i });
        fireEvent.click(button);
        expect(window.history.back).toHaveBeenCalledTimes(1);
    });
});
