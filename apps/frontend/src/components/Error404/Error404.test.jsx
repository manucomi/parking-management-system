import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import Error404 from './Error404';

describe('Error404 Component', () => {
    it('should render the Error404 component', () => {
        const { container } = render(<Error404 />);
        expect(container.children.length).toBe(1);
    });
});
