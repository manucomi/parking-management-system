import { initialize, mswLoader } from 'msw-storybook-addon';
import { http, HttpResponse } from 'msw';
import '@/scss/manifest.scss';

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
});

// Base URL for fetching resources
const redirectResourcesURL = 'https://hbr.org';

/** @type { import('@storybook/nextjs-vite').Preview } */
const preview = {
    loaders: [mswLoader],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            options: {
                runOnly: {
                    type: 'tag',
                    values: [
                        'best-practice',
                        'wcag2a',
                        'wcag2aa',
                        'wcag21a',
                        'wcag21aa',
                    ],
                },
            },
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo',
        },
        msw: {
            handlers: {
                redirect: [
                    http.get('/resources/*', ({ request }) => {
                        const url = new URL(request.url);
                        return new HttpResponse(null, {
                            status: 301,
                            headers: {
                                Location: `${redirectResourcesURL}${url.pathname}`,
                            },
                        });
                    }),
                ],
            },
        },
    },
    tags: ['autodocs'],
};

export default preview;
