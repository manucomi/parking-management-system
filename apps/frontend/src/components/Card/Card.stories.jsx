import React from 'react';
import Card from './Card';

export default {
    title: 'Components/Card',
    component: Card,
};

function Template(args) {
    return <Card {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    children: <div>Card content goes here</div>,
};

export const WithPadding = Template.bind({});
WithPadding.args = {
    children: <div style={{ padding: '1rem' }}>Card with custom padding</div>,
};
