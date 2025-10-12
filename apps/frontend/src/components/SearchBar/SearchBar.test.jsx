import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
    it('renders search input with placeholder', () => {
        render(
            <SearchBar placeholder="Search..." value="" onChange={() => {}} />,
        );
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('displays controlled value', () => {
        render(
            <SearchBar
                placeholder="Search"
                value="test query"
                onChange={() => {}}
            />,
        );
        const input = screen.getByPlaceholderText('Search');
        expect(input).toHaveValue('test query');
    });

    it('calls onChange when user types', async () => {
        const handleChange = jest.fn();
        const user = userEvent.setup();
        render(
            <SearchBar placeholder="Search" value="" onChange={handleChange} />,
        );
        const input = screen.getByPlaceholderText('Search');
        await user.type(input, 'a');
        expect(handleChange).toHaveBeenCalledWith('a');
    });

    it('renders right content when provided', () => {
        render(
            <SearchBar
                placeholder="Search"
                value=""
                onChange={() => {}}
                right={<button>Filter</button>}
            />,
        );
        expect(screen.getByText('Filter')).toBeInTheDocument();
    });
});
