import React from 'react';
import Modal from './Modal';

export default {
    title: 'Components/Modal',
    component: Modal,
};

export const Default = {
    args: {
        open: true,
        onClose: () => console.log('Modal closed'),
        children: <div style={{ padding: '2rem' }}>Modal content</div>,
    },
};
