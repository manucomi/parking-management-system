import React from 'react';
import CountDown from './CountDown';

export default {
    title: 'Components/CountDown',
    component: CountDown,
};

function Template(args) {
    return <CountDown {...args} />;
}

const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days from now

export const Default = {
    args: {
        targetDate: futureDate.toISOString(),
    },
};
