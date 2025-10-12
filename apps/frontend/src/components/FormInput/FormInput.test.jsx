import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from './FormInput';

describe('FormInput', () => {
    it('renders with label', () => {
        render(<FormInput label="Username" name="username" />);
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('renders input field', () => {
        render(<FormInput label="Email" name="email" type="email" />);
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'email');
    });

    it('handles user input', async () => {
        const user = userEvent.setup();
        render(<FormInput label="Name" name="name" />);
        const input = screen.getByRole('textbox');
        await user.type(input, 'John Doe');
        expect(input).toHaveValue('John Doe');
    });

    it('displays error message', () => {
        render(
            <FormInput
                label="Field"
                name="field"
                error="This field is required"
            />,
        );
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('renders as required', () => {
        render(<FormInput label="Required Field" name="field" required />);
        const input = screen.getByRole('textbox');
        expect(input).toBeRequired();
    });
});
