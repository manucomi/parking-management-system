import React from 'react';
import ConfirmModal from './ConfirmModal';

export default {
    title: 'Components/ConfirmModal',
    component: ConfirmModal,
};

function Template(args) {
    return <ConfirmModal {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled'),
};

export const DeleteAction = Template.bind({});
DeleteAction.args = {
    isOpen: true,
    title: 'Delete Item',
    message: 'This action cannot be undone. Are you sure?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: () => console.log('Deleted'),
    onCancel: () => console.log('Cancelled'),
};
