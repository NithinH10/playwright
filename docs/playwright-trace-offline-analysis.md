# Playwright Trace Files: Offline Analysis Guide

## What is Playwright?

Playwright is an end-to-end testing and browser automation framework that enables you to automate web browsers and test web applications. It supports multiple browser engines:

- **Chromium** (Chrome, Edge, Opera)
- **Firefox**
- **WebKit** (Safari)

### Why Use Playwright?

Playwright is designed for **reliability** and **CI/CD integration**. It provides:

- **UI Automation**: Automate user interactions like clicks, typing, navigation
- **Regression Testing**: Catch bugs before they reach production
- **Cross-browser Testing**: Test your app across different browsers
- **Rich Debugging Tools**: Screenshots, videos, traces, and detailed reports
- **Fast Execution**: Parallel test execution and auto-waiting for elements

### Where Can Playwright Be Used?

Playwright can be used in various scenarios:

1. **Web Apps (Frontend E2E)**: Test web applications running in browsers
2. **API Testing**: Use Playwright's request context for API testing
3. **Component Testing**: Test React, Vue, Svelte components in isolation
4. **Electron Desktop Apps**: Automate and test Electron applications
5. **Tauri Desktop Apps**: Test Tauri apps with some limitations (see Tauri section below)

---

## What is a Playwright Trace (trace.zip)?

A Playwright trace file (`trace.zip`) is a comprehensive recording of your test execution. It contains:

- **Step-by-step actions**: Every click, type, navigation, and assertion
- **DOM snapshots**: Full page state at each step
- **Screenshots**: Visual snapshots (if enabled)
- **Network activity**: HTTP requests, responses, and timing
- **Console logs**: JavaScript console output
- **Performance metrics**: Timing information for each action

### Why Traces Help

Traces are invaluable for:

- **Offline Debugging**: Analyze test failures without re-running tests
- **CI Artifacts**: Download traces from CI/CD pipelines for investigation
- **Reproducibility**: Share exact test execution with team members
- **Performance Analysis**: Identify slow operations and bottlenecks

### How to Open Trace Files

You have two options to view trace files:

#### Option A: Local Offline Viewer

Open a saved `trace.zip` file locally using the Playwright CLI:

```powershell
# Windows (PowerShell)
npx playwright show-trace path/to/trace.zip
```

```bash
# macOS/Linux
npx playwright show-trace path/to/trace.zip
```

This opens a local web server and displays the trace in your default browser.

#### Option B: Web Viewer (trace.playwright.dev)

Upload your trace file to the online viewer:

1. Open [trace.playwright.dev](https://trace.playwright.dev) in your browser
2. Drag and drop your `trace.zip` file, or click "Select file" to browse
3. Analyze the trace steps offline in your browser

**NOTE**: The trace viewer loads entirely in your browser and does not transmit any data externally. Your traces remain private.

---

## Browser-based Testing: Generate + Export Traces

For standard web browser testing, you have three options to enable tracing:

### Option 1: Via playwright.config.ts

Configure tracing in your Playwright configuration file:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Trace modes:
    // 'on' - Record trace for every test (can be large)
    // 'retain-on-failure' - Keep trace only if test fails
    // 'on-first-retry' - Record trace when retrying failed tests
    trace: 'retain-on-failure',
  },
});
```

**Trace Modes Explained:**

- `'on'`: Records trace for every test run. Useful for debugging, but generates large files.
- `'retain-on-failure'`: Only keeps traces when tests fail. Recommended for CI/CD.
- `'on-first-retry'`: Records trace only when a failed test is retried. Good balance between file size and debugging.

### Option 2: Via CLI

Enable tracing directly from the command line:

```powershell
# Windows (PowerShell)
npx playwright test --trace on
npx playwright test --trace retain-on-failure
npx playwright test --trace on-first-retry
```

```bash
# macOS/Linux
npx playwright test --trace on
npx playwright test --trace retain-on-failure
npx playwright test --trace on-first-retry
```

### Option 3: Manual Tracing Inside a Test

For fine-grained control, start and stop tracing programmatically:

```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page, context }) => {
  // Start tracing before actions
  await context.tracing.start({
    snapshots: true,
    screenshots: true,
  });

  // Perform your test actions
  await page.goto('https://example.com');
  await page.click('button');
  await expect(page.locator('h1')).toHaveText('Success');

  // Stop tracing and save to file
  await context.tracing.stop({ path: 'trace.zip' });
});
```

### Where Traces Are Saved

Traces are saved in different locations depending on your configuration:

- **Default location**: `test-results/` directory
- **Custom location**: Set via `outputDir` in `playwright.config.ts`
- **HTML Report**: Traces are linked in the HTML report generated by `npx playwright show-report`

### Opening the HTML Report

View all test results and traces in the HTML report:

```powershell
# Windows (PowerShell)
npx playwright show-report
```

```bash
# macOS/Linux
npx playwright show-report
```

### CI/CD Integration: GitHub Actions

To upload traces as CI artifacts in GitHub Actions:

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run tests
  run: npx playwright test

- name: Upload trace artifacts
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-traces
    path: test-results/
    retention-days: 30
```

**NOTE**: Use `if: always()` to upload traces even when tests fail.

---

## Electron Apps: Generate + Export Traces

Playwright can automate Electron applications and record traces of interactions with Electron windows.

### Option 1: Playwright Electron Automation

Here's a complete minimal example for tracing Electron apps:

```typescript
import { test, expect } from '@playwright/test';
import { _electron } from '@playwright/test';

test('electron app with tracing', async () => {
  // Launch Electron app
  const electronApp = await _electron.launch({
    executablePath: 'path/to/your-electron-app.exe', // or .app on macOS
  });

  // Get the first window
  const window = await electronApp.firstWindow();

  // Get the browser context for tracing
  const context = electronApp.context();

  // Start tracing
  await context.tracing.start({
    snapshots: true,
    screenshots: true,
  });

  // Perform UI steps
  await window.goto('https://example.com');
  await window.click('button');
  await expect(window.locator('h1')).toHaveText('Success');

  // Stop tracing and save trace.zip
  await context.tracing.stop({ path: 'electron-trace.zip' });

  // Close the app
  await electronApp.close();

  // Open trace offline
  // Run: npx playwright show-trace electron-trace.zip
});
```

**Key Points:**

- Use `_electron.launch()` to start your Electron app
- Access windows via `electronApp.firstWindow()` or `electronApp.windows()`
- Get the context via `electronApp.context()` for tracing
- Traces capture renderer process (web content) interactions
- Main process logs should be captured separately if needed

**NOTE**: Tracing in Electron primarily covers renderer/web contents interactions. For main process debugging, consider capturing logs separately.

---

## Tauri Apps: Reality + Workable Paths

Tauri applications use OS-native webviews:

- **Windows**: WebView2 (Chromium-based)
- **macOS**: WKWebView (WebKit-based)
- **Linux**: WebKitGTK (WebKit-based)

Playwright trace files work best when Playwright is directly driving the browser context. With Tauri, this is more complex.

### Option A (Recommended): Test the Same UI in a Normal Browser

**When to use**: When your Tauri app's UI is similar to a web version, or when you can run the same UI code in a browser.

**Pros:**

- Full Playwright trace support
- Easier to set up and maintain
- Works on all platforms
- Better debugging experience

**Cons:**

- Doesn't test the actual Tauri app
- May miss Tauri-specific issues

**Example:**

```typescript
import { test, expect } from '@playwright/test';

test('test UI in browser instead of Tauri', async ({ page, context }) => {
  // Start tracing
  await context.tracing.start({ snapshots: true });

  // Load the same UI that runs in Tauri
  await page.goto('http://localhost:3000'); // Your dev server

  // Test the UI
  await page.click('button');
  await expect(page.locator('h1')).toHaveText('Success');

  // Save trace
  await context.tracing.stop({ path: 'tauri-ui-trace.zip' });
});
```

### Option B (Windows Best): WebView2 Remote Debugging + connectOverCDP

**When to use**: When you need to test the actual Tauri app on Windows.

**Step-by-step:**

1. **Enable remote debugging in your Tauri app** (Windows only):

   Set the environment variable before launching your Tauri app:

   ```powershell
   # Windows (PowerShell)
   $env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = "--remote-debugging-port=9222"
   ```

   ```bash
   # macOS/Linux (not applicable - WebView2 is Windows-only)
   export WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS="--remote-debugging-port=9222"
   ```
2. **Launch your Tauri app** with the environment variable set.
3. **Connect Playwright via CDP**:

   ```typescript
   import { test, expect } from '@playwright/test';
   import { chromium } from '@playwright/test';

   test('tauri app via CDP', async () => {
     // Connect to WebView2 via Chrome DevTools Protocol
     const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
     const context = browser.contexts()[0];
     const page = context.pages()[0];

     // Start tracing
     await context.tracing.start({ snapshots: true });

     // Perform actions
     await page.click('button');
     await expect(page.locator('h1')).toHaveText('Success');

     // Save trace
     await context.tracing.stop({ path: 'tauri-trace.zip' });

     await browser.close();
   });
   ```
4. **For parallel runs**, use unique ports and user data folders:

   ```typescript
   const port = 9222 + testInfo.workerIndex;
   const userDataDir = `./webview2-data-${testInfo.workerIndex}`;

   process.env.WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = `--remote-debugging-port=${port}`;
   process.env.WEBVIEW2_USER_DATA_FOLDER = userDataDir;
   ```

**WARNINGS:**

- ⚠️ **CDP is Chromium-only**: This only works on Windows with WebView2. macOS (WKWebView) and Linux (WebKitGTK) don't support CDP.
- ⚠️ **Lower fidelity**: CDP connection is less reliable than normal Playwright launch. Some features may not work perfectly.
- ⚠️ **Parallel runs**: Each test needs a unique WebView2 user data folder (use `WEBVIEW2_USER_DATA_FOLDER`).

### Option C (Official Tauri Approach): tauri-driver + WebDriver

**When to use**: When you need cross-platform Tauri testing (Windows/Linux).

**Limitations:**

- **macOS desktop not supported**: WKWebView doesn't have a WebDriver implementation
- **Not Playwright-driven**: Uses WebDriver protocol, so you won't get Playwright `trace.zip` files

**Alternatives for debugging:**

- **Screenshots**: Take screenshots at key points
- **Video recording**: If your test framework supports it
- **Logs**: Capture console logs and application logs

**Example with tauri-driver:**

```typescript
// This uses WebDriver, not Playwright tracing
import { Builder, By, until } from 'selenium-webdriver';

// Note: This won't generate Playwright trace.zip files
// Use screenshots and logs instead for debugging
```

---

## Troubleshooting

### Issue: trace.zip Not Generated

**Possible causes and fixes:**

1. **Tracing not enabled**: Check your `playwright.config.ts` or ensure you're using `--trace` flag
2. **Test didn't run**: Verify tests actually executed
3. **Wrong output directory**: Check `test-results/` or your configured `outputDir`
4. **Test passed with `retain-on-failure`**: Traces are only saved on failures with this mode

**Fix:**

```typescript
// Force tracing for all tests
use: {
  trace: 'on', // Change from 'retain-on-failure' to 'on'
}
```

Or use manual tracing:

```typescript
await context.tracing.start();
// ... your test ...
await context.tracing.stop({ path: 'trace.zip' });
```

### Issue: Trace Too Large

**Possible causes:**

- Recording traces for all tests (`trace: 'on'`)
- Including screenshots for every step
- Long-running tests with many actions

**Fixes:**

1. **Use `retain-on-failure` mode**:

   ```typescript
   use: {
     trace: 'retain-on-failure', // Only save on failures
   }
   ```
2. **Disable screenshots**:

   ```typescript
   await context.tracing.start({
     snapshots: true,
     screenshots: false, // Disable screenshots
   });
   ```
3. **Limit trace to specific tests**:

   ```typescript
   test('important test', async ({ context }) => {
     await context.tracing.start();
     // ... test code ...
     await context.tracing.stop({ path: 'trace.zip' });
   });
   ```

### Issue: Missing Screenshots/Snapshots

**Possible causes:**

- Screenshots disabled in trace configuration
- Snapshots disabled
- Trace mode doesn't include them

**Fix:**

```typescript
await context.tracing.start({
  snapshots: true,      // Enable DOM snapshots
  screenshots: true,    // Enable screenshots
});
```

Or in config:

```typescript
use: {
  trace: 'on',
  screenshot: 'only-on-failure', // Or 'on'
}
```

### Issue: connectOverCDP Fails

**Possible causes:**

- WebView2 not listening on the port
- Port already in use
- Wrong port number
- Tauri app not launched with remote debugging

**Fixes:**

1. **Verify environment variable is set**:

   ```powershell
   # Windows (PowerShell)
   echo $env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS
   # Should show: --remote-debugging-port=9222
   ```
2. **Check if port is in use**:

   ```powershell
   # Windows (PowerShell)
   netstat -ano | findstr :9222
   ```

   ```bash
   # macOS/Linux
   lsof -i :9222
   ```
3. **Use a different port**:

   ```typescript
   const port = 9223; // Try a different port
   process.env.WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = `--remote-debugging-port=${port}`;
   const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
   ```
4. **Wait for app to be ready**:

   ```typescript
   // Wait a bit for WebView2 to initialize
   await new Promise(resolve => setTimeout(resolve, 2000));
   const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
   ```

### Issue: Electron Window Not Found

**Possible causes:**

- Window not created yet
- Wrong window reference
- App not fully initialized

**Fixes:**

1. **Wait for window**:

   ```typescript
   const window = await electronApp.firstWindow();
   // Or wait for a specific window
   await electronApp.waitForEvent('window');
   ```
2. **Check all windows**:

   ```typescript
   const windows = electronApp.windows();
   console.log(`Found ${windows.length} windows`);
   const window = windows[0];
   ```
3. **Wait for app ready**:

   ```typescript
   await electronApp.evaluate(async ({ app }) => {
     await app.whenReady();
   });
   const window = await electronApp.firstWindow();
   ```

### Issue: Trace Opens But Shows Blank

**Possible causes:**

- Corrupted trace file
- Incomplete trace recording
- Browser compatibility issue

**Fixes:**

1. **Regenerate the trace**: Run the test again and ensure tracing completes
2. **Check trace file size**: Empty or very small files indicate incomplete recording
3. **Try different viewer**: Use `npx playwright show-trace` instead of trace.playwright.dev (or vice versa)
4. **Verify trace completion**:

   ```typescript
   // Ensure stop() completes before closing
   await context.tracing.stop({ path: 'trace.zip' });
   // Don't close context/browser immediately after
   await page.close(); // Close after trace is saved
   ```

---

## Quick Checklist

Use this checklist to ensure you're capturing and analyzing traces correctly:

### Before Running Tests

- [X] Enable tracing in `playwright.config.ts` or via CLI (`--trace` flag)
- [ ] Choose appropriate trace mode (`on`, `retain-on-failure`, or `on-first-retry`)
- [ ] Configure output directory if needed

### During Test Execution

- [ ] Run tests: `npx playwright test`
- [ ] Verify tests execute and traces are being recorded

### After Tests Complete

- [ ] Locate `trace.zip` files (usually in `test-results/` directory)
- [ ] Open trace with: `npx playwright show-trace path/to/trace.zip`
- [ ] Or upload to [trace.playwright.dev](https://trace.playwright.dev)

### For CI/CD

- [ ] Configure artifact upload in CI pipeline
- [ ] Set `if: always()` to upload traces even on test failures
- [ ] Include trace files in bug reports or pull requests

### For Electron Apps

- [ ] Launch Electron app with `_electron.launch()`
- [ ] Get window via `electronApp.firstWindow()`
- [ ] Start tracing on `electronApp.context()`
- [ ] Stop tracing and save to `trace.zip`
- [ ] Open trace offline with `show-trace`

### For Tauri Apps

- [ ] **Option A**: Test UI in normal browser (recommended)
- [ ] **Option B (Windows)**: Enable WebView2 remote debugging and use `connectOverCDP`
- [ ] **Option C**: Use tauri-driver (no Playwright traces, use screenshots/logs instead)

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Trace Viewer Documentation](https://playwright.dev/docs/trace-viewer)
- [Electron Testing Guide](https://playwright.dev/docs/api/class-electronapplication)
- [WebView2 Documentation](https://playwright.dev/docs/webview2)

---

**Last Updated**: This guide covers Playwright trace file generation and offline analysis for browser, Electron, and Tauri applications.
