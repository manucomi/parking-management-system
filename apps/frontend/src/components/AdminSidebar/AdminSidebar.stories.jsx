import React from 'react';
import AdminSidebar from './AdminSidebar';

export default {
    title: 'Components/AdminSidebar',
    component: AdminSidebar,
};

function Template(args) {
    return <AdminSidebar {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    currentPath: '/admin',
};

export const DashboardActive = Template.bind({});
DashboardActive.args = {
    currentPath: '/admin',
};

export const RaffleActive = Template.bind({});
RaffleActive.args = {
    currentPath: '/admin/raffle',
};
