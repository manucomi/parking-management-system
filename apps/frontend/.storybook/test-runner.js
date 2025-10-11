const { injectAxe, checkA11y } = require('axe-playwright');

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
module.exports = {
    async preVisit(page) {
        await injectAxe(page);
    },
    async postVisit(page) {
        await checkA11y(page, 'body', {
            axeOptions: {
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
            detailedReport: true,
            detailedReportOptions: {
                html: true,
            },
        });
    },
};
