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
    // The defaults above are root-anchored, so a build directory nested anywhere else
    // (a git worktree, a vendored copy) still gets linted. Match them at any depth.
    "**/.next/**",
    "**/node_modules/**",
    // Agent scratch worktrees are full second checkouts of this repo. Even with their
    // build output ignored, linting them double-reports every finding against a
    // detached-HEAD copy of code that isn't on main.
    ".claude/worktrees/**",
  ]),
]);

export default eslintConfig;
