import React from 'react';
import Card from './Card';

export default {
    title: 'Components/Card',
    component: Card,
};

export const Default = {
    args: {
        title: 'Card Title',
        subtitle: 'Card Subtitle',
        right: <button>Action</button>,
        children: 'This is the content of the card.',
    },
};
