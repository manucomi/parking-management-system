import React from 'react';
import Tabs from './Tabs';

export default {
    title: 'Components/Tabs',
    component: Tabs,
};

export const Default = {
    args: {
        tabs: ['Profile', 'Settings', 'Notifications'],
        activeTab: 0,
        onTabChange: (index) => console.log('Tab changed to:', index),
    },
};
