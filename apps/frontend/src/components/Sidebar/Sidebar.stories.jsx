import React from 'react';
import Sidebar from './Sidebar';

export default {
    title: 'Components/Sidebar',
    component: Sidebar,
};

function Template(args) {
    return <Sidebar {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    user: {
        name: 'John Doe',
        role: 'Admin',
    },
    isCollapsed: false,
};

export const Collapsed = Template.bind({});
Collapsed.args = {
    user: {
        name: 'John Doe',
        role: 'Admin',
    },
    isCollapsed: true,
};
