import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from './Tabs';

describe('Tabs', () => {
    const tabs = ['Login', 'Register', 'Admin'];

    it('renders all tab labels', () => {
        render(<Tabs tabs={tabs} active="Login" onChange={() => {}} />);
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('calls onChange when tab is clicked', async () => {
        const handleChange = jest.fn();
        const user = userEvent.setup();
        render(<Tabs tabs={tabs} active="Login" onChange={handleChange} />);
        await user.click(screen.getByText('Register'));
        expect(handleChange).toHaveBeenCalledWith('Register');
    });

    it('applies active class to current tab', () => {
        render(<Tabs tabs={tabs} active="Register" onChange={() => {}} />);
        const registerTab = screen.getByText('Register');
        expect(registerTab).toHaveClass('active');
    });

    it('does not apply active class to inactive tabs', () => {
        render(<Tabs tabs={tabs} active="Login" onChange={() => {}} />);
        const registerTab = screen.getByText('Register');
        expect(registerTab).not.toHaveClass('active');
    });

    it('renders without active tab', () => {
        render(<Tabs tabs={tabs} active={null} onChange={() => {}} />);
        const loginTab = screen.getByText('Login');
        expect(loginTab).not.toHaveClass('active');
    });

    it('renders with empty tabs array', () => {
        const { container } = render(
            <Tabs tabs={[]} active={null} onChange={() => {}} />,
        );
        expect(container.querySelector('.tabs')).toBeInTheDocument();
    });

    it('renders without tabs prop using default', () => {
        const { container } = render(
            <Tabs active={null} onChange={() => {}} />,
        );
        expect(container.querySelector('.tabs')).toBeInTheDocument();
    });
});
