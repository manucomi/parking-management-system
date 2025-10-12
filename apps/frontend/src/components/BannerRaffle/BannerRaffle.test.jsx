import { render, screen } from '@testing-library/react';
import BannerRaffle from './BannerRaffle';

describe('BannerRaffle', () => {
    it('renders raffle date', () => {
        render(<BannerRaffle date="Oct 15, 2025" registeredCount={42} />);
        expect(
            screen.getByText(/Next Raffle: Oct 15, 2025/),
        ).toBeInTheDocument();
    });

    it('displays registered count', () => {
        render(<BannerRaffle date="Oct 20" registeredCount={25} />);
        expect(
            screen.getByText(/25 residents have registered/),
        ).toBeInTheDocument();
    });

    it('renders CTA when provided', () => {
        render(
            <BannerRaffle
                date="Oct 15"
                registeredCount={10}
                cta={<button>Join Now</button>}
            />,
        );
        expect(screen.getByText('Join Now')).toBeInTheDocument();
    });

    it('renders without CTA', () => {
        render(<BannerRaffle date="Oct 15" registeredCount={5} />);
        expect(screen.getByText(/Next Raffle/)).toBeInTheDocument();
    });
});
