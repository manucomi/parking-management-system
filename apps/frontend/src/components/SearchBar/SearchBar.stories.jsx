import React from 'react';
import SearchBar from './SearchBar';

export default {
    title: 'Components/SearchBar',
    component: SearchBar,
};

function Template(args) {
    return <SearchBar {...args} />;
}

export const Default = Template.bind({});
Default.args = {
    placeholder: 'Search...',
    onSearch: (query) => console.log('Search query:', query),
};

export const WithValue = Template.bind({});
WithValue.args = {
    placeholder: 'Search residents...',
    value: 'John',
    onSearch: (query) => console.log('Search query:', query),
};
