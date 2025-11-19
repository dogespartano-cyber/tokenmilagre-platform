import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../app/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../app/recursos/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../app/recursos/[slug]/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../app/dashboard/_components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../app/dashboard/criar-artigo/_components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
    "@storybook/addon-a11y"
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {}
  },
  staticDirs: [
    "../public"
  ],
  docs: {
    autodocs: true
  }
};
export default config;