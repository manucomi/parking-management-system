import React from 'react';
import Tabs from './Tabs';

export default {
    title: 'Components/Tabs',
    component: Tabs,
};

function Template(args) {
    return <Tabs {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
    activeTab: 0,
    onTabChange: (index) => console.log('Tab changed to:', index),
};

export const WithContent = Template.bind({});
WithContent.args = {
    tabs: ['Profile', 'Settings', 'Notifications'],
    activeTab: 0,
    onTabChange: (index) => console.log('Tab changed to:', index),
};
