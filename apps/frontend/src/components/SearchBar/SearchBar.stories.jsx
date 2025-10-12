import React from 'react';
import SearchBar from './SearchBar';

export default {
    title: 'Components/SearchBar',
    component: SearchBar,
};

export const Default = {
    args: {
        placeholder: 'Search...',
        onSearch: (query) => console.log('Search query:', query),
    },
};
