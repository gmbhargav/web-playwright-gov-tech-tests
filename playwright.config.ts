import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  testMatch: '**/*.spec.ts',
  timeout: 30000,
  retries: 1,
  workers: process.env.CI ? 2 : 4,
  
  reporter: [
    ['html'],
    ['list']
  ],
  
  use: {
    baseURL: process.env.TEST_TYPE === 'api' 
      ? 'https://swapi.dev/api' 
      : 'https://demoqa.com',
    
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'ui-chrome',
      testMatch: '**/web-tests/tests/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'api',
      testMatch: '**/api-tests/**/*.spec.ts',
      use: {
        baseURL: 'https://swapi.dev/api',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Playwright-API-Tests/1.0'
        },
        
        // API-specific logging
        launchOptions: {
          args: ['--log-level=0', '--v=1'],
        },
        
         // Capture all API request/response details
        contextOptions: {
          recordHar: {
            path: './test-results/har-files/api-test.har',
            mode: 'full',
            content: 'embed' // Embed response content for API tests
          }
        },
        // Custom request logger for API tests
        // _apiLogger removed: Playwright config does not support custom properties here
      },
    },
  ],
});