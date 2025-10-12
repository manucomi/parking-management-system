import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
    it('renders when open', () => {
        render(
            <Modal open={true} title="Test Modal" onClose={() => {}}>
                <div>Modal Content</div>
            </Modal>,
        );
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(
            <Modal open={false} title="Test" onClose={() => {}}>
                <div>Modal Content</div>
            </Modal>,
        );
        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('calls onClose when close button clicked', async () => {
        const handleClose = jest.fn();
        const user = userEvent.setup();
        render(
            <Modal open={true} title="Test" onClose={handleClose}>
                <div>Content</div>
            </Modal>,
        );
        const closeButton = screen.getByText('×');
        await user.click(closeButton);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('renders with title', () => {
        render(
            <Modal open={true} onClose={() => {}} title="Test Modal">
                <div>Content</div>
            </Modal>,
        );
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('calls onClose when backdrop clicked', async () => {
        const handleClose = jest.fn();
        const user = userEvent.setup();
        const { container } = render(
            <Modal open={true} title="Test" onClose={handleClose}>
                <div>Content</div>
            </Modal>,
        );
        const backdrop = container.firstChild;
        await user.click(backdrop);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('renders actions when provided', () => {
        render(
            <Modal
                open={true}
                title="Test"
                onClose={() => {}}
                actions={<button>Action</button>}
            >
                <div>Content</div>
            </Modal>,
        );
        expect(screen.getByText('Action')).toBeInTheDocument();
    });
});
