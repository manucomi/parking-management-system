import React from 'react';
import Button from './Button';

export default {
    title: 'Components/Button',
    component: Button,
};

function Template(args) {
    return <Button {...args} />;
}

export const Primary = Template.bind({});
Primary.args = {
    children: 'Primary Button',
    variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
    children: 'Secondary Button',
    variant: 'accent',
};

export const Disabled = Template.bind({});
Disabled.args = {
    children: 'Disabled Button',
    disabled: true,
};
