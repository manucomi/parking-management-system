import React from 'react';
import Pagination from './Pagination';

export default {
    title: 'Components/Pagination',
    component: Pagination,
};

function Template(args) {
    return <Pagination {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log('Page changed to:', page),
};

export const MiddlePage = Template.bind({});
MiddlePage.args = {
    currentPage: 5,
    totalPages: 10,
    onPageChange: (page) => console.log('Page changed to:', page),
};

export const LastPage = Template.bind({});
LastPage.args = {
    currentPage: 10,
    totalPages: 10,
    onPageChange: (page) => console.log('Page changed to:', page),
};
