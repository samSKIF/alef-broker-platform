import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The design handoff bundle isn't part of our codebase — those JSX files
    // rely on globals injected by <script> tags, so they trip undefined-name
    // rules. They're a reference, not source.
    "design/**",
  ]),
]);

export default eslintConfig;
