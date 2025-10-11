import React from 'react';
import Banner from './Banner';

export default {
    title: 'Components/Banner',
    component: Banner,
};

function Template(args) {
    return <Banner {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    message: 'Welcome to the Parking Management System',
    type: 'info',
};

export const Success = Template.bind({});
Success.args = {
    message: 'Operation completed successfully!',
    type: 'success',
};

export const Warning = Template.bind({});
Warning.args = {
    message: 'Please review your information',
    type: 'warning',
};

export const Error = Template.bind({});
Error.args = {
    message: 'An error occurred. Please try again.',
    type: 'error',
};
