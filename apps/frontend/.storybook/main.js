import path from 'path';

/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  staticDirs: ['./public'],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
    "@storybook/addon-a11y"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  async viteFinal(config, options) {
    const newConfig = config;
    newConfig.resolve = config.resolve || {};
    newConfig.resolve.alias = config.resolve.alias || {};
    newConfig.resolve.alias = { ...newConfig.resolve.alias, '@': path.resolve(__dirname, '../src') };
    return newConfig;
  },
};
export default config;