import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination', () => {
    it('renders current page and total pages', () => {
        render(
            <Pagination
                page={1}
                total={5}
                onPrev={() => {}}
                onNext={() => {}}
            />,
        );
        expect(screen.getByText(/1 \/ 5/)).toBeInTheDocument();
    });

    it('calls onNext when next is clicked', async () => {
        const handleNext = jest.fn();
        const user = userEvent.setup();
        render(
            <Pagination
                page={1}
                total={5}
                onPrev={() => {}}
                onNext={handleNext}
            />,
        );
        const nextButton = screen.getByText('Next');
        await user.click(nextButton);
        expect(handleNext).toHaveBeenCalledTimes(1);
    });

    it('calls onPrev when previous is clicked', async () => {
        const handlePrev = jest.fn();
        const user = userEvent.setup();
        render(
            <Pagination
                page={3}
                total={5}
                onPrev={handlePrev}
                onNext={() => {}}
            />,
        );
        const prevButton = screen.getByText('Previous');
        await user.click(prevButton);
        expect(handlePrev).toHaveBeenCalledTimes(1);
    });

    it('disables previous on first page', () => {
        render(
            <Pagination
                page={1}
                total={5}
                onPrev={() => {}}
                onNext={() => {}}
            />,
        );
        const prevButton = screen.getByText('Previous');
        expect(prevButton).toBeDisabled();
    });

    it('disables next on last page', () => {
        render(
            <Pagination
                page={5}
                total={5}
                onPrev={() => {}}
                onNext={() => {}}
            />,
        );
        const nextButton = screen.getByText('Next');
        expect(nextButton).toBeDisabled();
    });

    it('uses default values when props not provided', () => {
        render(<Pagination onPrev={() => {}} onNext={() => {}} />);
        expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument();
    });
});
