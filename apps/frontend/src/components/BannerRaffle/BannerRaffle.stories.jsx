import React from 'react';
import BannerRaffle from './BannerRaffle';

export default {
    title: 'Components/BannerRaffle',
    component: BannerRaffle,
};

function Template(args) {
    return <BannerRaffle {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    title: 'Monthly Parking Raffle',
    description: 'Enter the raffle for a chance to win a premium parking spot!',
    date: '2025-10-15',
};

export const Active = Template.bind({});
Active.args = {
    title: 'Active Raffle',
    description: 'Raffle is currently open for entries',
    date: '2025-10-20',
    status: 'active',
};
