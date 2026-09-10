import { defineConfig } from 'allure';

/**
 * Minimal Allure 3 setup. The Awesome plugin's generated index.html IS the
 * report (Report / Graphs / Timeline via its own dropdown) — no extra plugins.
 *
 * `historyPath` lives outside `allure-report/` so cleaning the report never
 * discards trend history. Trend charts render from the 2nd generated report on.
 */
export default defineConfig({
  name: 'Portfolio QA Engineering',
  output: './allure-report',
  historyPath: './.allure/history.jsonl',
  plugins: {
    awesome: {
      options: {
        reportLanguage: 'en',
      },
    },
  },
});
