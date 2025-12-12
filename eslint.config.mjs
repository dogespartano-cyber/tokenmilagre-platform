// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import themePlugin from "./eslint-plugins/theme.mjs";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "scripts/**",
      "lib/generated/**",
      "**/*.js"
    ],
  },
  // Plugin customizado para regras de tema
  {
    plugins: {
      theme: themePlugin,
    },
    rules: {
      // Warn sobre cores hardcoded (não bloqueia build, mas avisa)
      "theme/no-hardcoded-colors": "warn",
    },
  },
  ...storybook.configs["flat/recommended"]
];

export default eslintConfig;
