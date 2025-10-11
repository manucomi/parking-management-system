import React from 'react';
import Table from './Table';

export default {
    title: 'Components/Table',
    component: Table,
};

function Template(args) {
    return <Table {...args} />;
}

const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
];

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
];

export const Default = Template.bind({});
Default.args = {
    data: sampleData,
    columns: columns,
};

export const Empty = Template.bind({});
Empty.args = {
    data: [],
    columns: columns,
};
