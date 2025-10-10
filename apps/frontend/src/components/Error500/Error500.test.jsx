import { render, screen } from '@testing-library/react';
import Error500 from './Error500';

describe('Error500', () => {
    it('renders the error image with correct attributes', () => {
        render(<Error500 />);

        const image = screen.getByRole('img', {
            name: "Hmmmm... We can't seem to find that page.",
        });

        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute(
            'src',
            '/resources/images/editorial_assets/misc/server-error.png',
        );
    });
});
