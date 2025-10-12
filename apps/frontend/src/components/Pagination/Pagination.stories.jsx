import React from 'react';
import Pagination from './Pagination';

export default {
    title: 'Components/Pagination',
    component: Pagination,
};

function Template(args) {
    return <Pagination {...args} />;
}

export const Default = {
    args: {
        page: 1,
        total: 10,
    },
};
