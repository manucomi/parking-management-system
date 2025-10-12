import React from 'react';
import ConfirmModal from './ConfirmModal';

export default {
    title: 'Components/ConfirmModal',
    component: ConfirmModal,
};

export const Default = {
    args: {
        open: true,
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        onConfirm: () => console.log('Confirmed'),
        onCancel: () => console.log('Cancelled'),
    },
};
