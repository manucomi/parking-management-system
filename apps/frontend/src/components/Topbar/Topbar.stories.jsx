import React from 'react';
import Topbar from './Topbar';

export default {
    title: 'Components/Topbar',
    component: Topbar,
};

function Template(args) {
    return <Topbar {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    user: {
        name: 'John Doe',
        role: 'Admin',
    },
};

export const WithNotifications = Template.bind({});
WithNotifications.args = {
    user: {
        name: 'Jane Smith',
        role: 'Resident',
    },
    notifications: 3,
};
