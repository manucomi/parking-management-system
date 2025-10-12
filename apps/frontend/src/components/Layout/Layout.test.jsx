import { render, screen } from '@testing-library/react';
import Layout from './Layout';

describe('Layout', () => {
    it('renders children content', () => {
        render(
            <Layout sidebar={<nav>Nav</nav>}>
                <div>Test Content</div>
            </Layout>,
        );
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with sidebar', () => {
        render(
            <Layout sidebar={<nav>Sidebar</nav>}>
                <div>Main Content</div>
            </Layout>,
        );
        expect(screen.getByText('Sidebar')).toBeInTheDocument();
    });

    it('renders main element', () => {
        render(
            <Layout sidebar={<nav>Nav</nav>}>
                <div>Content</div>
            </Layout>,
        );
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders without sidebar', () => {
        render(
            <Layout>
                <div>Content</div>
            </Layout>,
        );
        expect(screen.getByText('Content')).toBeInTheDocument();
    });
});
