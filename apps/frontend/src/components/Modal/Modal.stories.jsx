import React from 'react';
import Modal from './Modal';

export default {
    title: 'Components/Modal',
    component: Modal,
};

function Template(args) {
    return <Modal {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    children: <div style={{ padding: '2rem' }}>Modal content</div>,
};

export const WithTitle = Template.bind({});
WithTitle.args = {
    isOpen: true,
    title: 'Modal Title',
    onClose: () => console.log('Modal closed'),
    children: <div style={{ padding: '2rem' }}>Modal content with title</div>,
};
