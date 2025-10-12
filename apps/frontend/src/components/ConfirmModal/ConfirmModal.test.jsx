import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from './ConfirmModal';

// Mock SCSS module (if you use identity-obj-proxy, this can be skipped)
jest.mock('./ConfirmModal.module.scss', () => ({
    backdrop: 'backdrop',
    modal: 'modal',
    head: 'head',
    body: 'body',
    footer: 'footer',
    ghost: 'ghost',
    primary: 'primary',
}));

describe('ConfirmModal', () => {
    const defaultProps = {
        open: true,
        title: 'Delete item',
        description: 'Are you sure you want to delete this?',
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders nothing when open is false', () => {
        const { container } = render(
            <ConfirmModal {...defaultProps} open={false} />,
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders title and description when open', () => {
        render(<ConfirmModal {...defaultProps} />);
        expect(screen.getByText('Delete item')).toBeInTheDocument();
        expect(
            screen.getByText('Are you sure you want to delete this?'),
        ).toBeInTheDocument();
    });

    it('calls onCancel when Cancel button is clicked', () => {
        render(<ConfirmModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Cancel'));
        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onConfirm when Confirm button is clicked', () => {
        render(<ConfirmModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Confirm'));
        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when clicking on backdrop', () => {
        render(<ConfirmModal {...defaultProps} />);
        const backdrop = screen
            .getByText('Delete item')
            .closest('div.backdrop');
        fireEvent.click(backdrop);
        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('does NOT call onCancel when clicking inside modal', () => {
        render(<ConfirmModal {...defaultProps} />);
        const modal = screen.getByText('Delete item').closest('div.modal');
        fireEvent.click(modal);
        expect(defaultProps.onCancel).not.toHaveBeenCalled();
    });
});
