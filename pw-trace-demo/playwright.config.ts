import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    trace: 'on', // always export trace.zip
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  reporter: [['html', { open: 'never' }]],
});

