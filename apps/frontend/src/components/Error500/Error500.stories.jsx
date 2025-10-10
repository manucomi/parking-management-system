import Error500 from './Error500';

export default {
    title: 'Components/Error500',
    component: Error500,
    decorators: [
        (Story) => (
            <main>
                <Story />
            </main>
        ),
    ],
};

export const Default = {};
