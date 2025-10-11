import React from 'react';
import FormInput from './FormInput';

export default {
    title: 'Components/FormInput',
    component: FormInput,
};

function Template(args) {
    return <FormInput {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
};

export const WithError = Template.bind({});
WithError.args = {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    error: 'This field is required',
};

export const Password = Template.bind({});
Password.args = {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
};
