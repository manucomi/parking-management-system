import { render, screen } from '@testing-library/react';
import Layout from './Layout';

describe('Layout Component', () => {
    it('renders the layout component', () => {
        render(<Layout>Render content inside a layout</Layout>);
        expect(
            screen.getByText('Render content inside a layout'),
        ).toBeInTheDocument();
    });
});
