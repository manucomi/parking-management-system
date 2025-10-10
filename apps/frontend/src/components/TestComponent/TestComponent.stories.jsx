import React from 'react';
import TestComponent from './TestComponent';

export default {
    title: 'Components/TestComponent',
    component: TestComponent,
};

function Template(args) {
    return <TestComponent {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    // Add default props here
};
