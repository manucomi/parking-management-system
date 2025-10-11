import React from 'react';
import KpiCard from './KpiCard';

export default {
    title: 'Components/KpiCard',
    component: KpiCard,
};

function Template(args) {
    return <KpiCard {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    title: 'Total Users',
    value: '1,234',
    icon: '👥',
};

export const WithTrend = Template.bind({});
WithTrend.args = {
    title: 'Revenue',
    value: '$12,345',
    trend: '+12%',
    icon: '💰',
};

export const Negative = Template.bind({});
Negative.args = {
    title: 'Pending Tasks',
    value: '23',
    trend: '-5%',
    icon: '📋',
};
