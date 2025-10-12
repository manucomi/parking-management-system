import { render, screen, act } from '@testing-library/react';
import Countdown from './Countdown';
import { daysHoursMinutesUntil } from '@/lib/date';

// ✅ Mock the entire module before imports are used
jest.mock('@/lib/date', () => ({
    daysHoursMinutesUntil: jest.fn(),
}));

jest.useFakeTimers();

describe('Countdown', () => {
    const mockToDate = '2025-12-31T00:00:00Z';

    beforeEach(() => {
        daysHoursMinutesUntil.mockReturnValue({
            days: 10,
            hours: 5,
            minutes: 30,
        });
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.restoreAllMocks();
    });

    it('renders the initial countdown', () => {
        render(<Countdown to={mockToDate} />);
        expect(screen.getByText(/10d 5h 30m/)).toBeInTheDocument();
    });

    it('updates countdown every 30 seconds', () => {
        daysHoursMinutesUntil
            .mockReturnValueOnce({ days: 10, hours: 5, minutes: 30 })
            .mockReturnValueOnce({ days: 10, hours: 5, minutes: 29 });

        render(<Countdown to={mockToDate} />);

        act(() => {
            jest.advanceTimersByTime(30_000);
        });

        expect(daysHoursMinutesUntil).toHaveBeenCalledTimes(3);
        expect(screen.getByText(/10d 5h 29m/)).toBeInTheDocument();
    });

    it('clears interval on unmount', () => {
        const clearSpy = jest.spyOn(global, 'clearInterval');
        const { unmount } = render(<Countdown to={mockToDate} />);
        unmount();
        expect(clearSpy).toHaveBeenCalled();
    });
});
