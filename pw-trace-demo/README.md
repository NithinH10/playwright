# Playwright Trace Demo

This is a minimal Playwright test project that demonstrates how to generate and analyze `trace.zip` files for offline debugging.

## What is a Playwright Trace?

A Playwright trace (`trace.zip`) is a comprehensive recording of your test execution that contains:
- **Step-by-step actions**: Every click, type, navigation, and assertion
- **DOM snapshots**: Full page state at each step
- **Screenshots**: Visual snapshots (if enabled)
- **Network activity**: HTTP requests, responses, and timing
- **Console logs**: JavaScript console output
- **Performance metrics**: Timing information for each action

Traces are invaluable for:
- **Offline Debugging**: Analyze test failures without re-running tests
- **CI Artifacts**: Download traces from CI/CD pipelines for investigation
- **Reproducibility**: Share exact test execution with team members
- **Performance Analysis**: Identify slow operations and bottlenecks

## Setup

### Windows PowerShell

```powershell
# 1) Navigate to the demo folder
cd pw-trace-demo

# 2) Install dependencies
npm install

# 3) Install Playwright browsers
npx playwright install

# 4) Run test with tracing enabled (generates trace.zip)
npm run test:trace

# 5) Find the generated trace.zip file
Get-ChildItem -Recurse -Filter trace.zip | Select-Object FullName

# 6) Open trace offline (replace with actual path from step 5)
npx playwright show-trace "pw-trace-demo\test-results\<test-name>\trace.zip"
```

### Git Bash / Linux / macOS

```bash
# 1) Navigate to the demo folder
cd pw-trace-demo

# 2) Install dependencies
npm install

# 3) Install Playwright browsers
npx playwright install

# 4) Run test with tracing enabled (generates trace.zip)
npm run test:trace

# 5) Find the generated trace.zip file
find . -name "trace.zip"

# 6) Open trace offline (replace with actual path from step 5)
npx playwright show-trace "pw-trace-demo/test-results/<test-name>/trace.zip"
```

## Where are trace.zip files generated?

After running `npm run test:trace`, Playwright generates trace files in:
```
pw-trace-demo/test-results/<test-name>/trace.zip
```

For example:
- `pw-trace-demo/test-results/smoke-trace-smoke/trace.zip`

## Viewing Traces

### Option 1: Local Offline Viewer (Recommended)

Use the Playwright CLI to open traces locally:

```powershell
# Windows PowerShell
npx playwright show-trace "path\to\trace.zip"
```

```bash
# Git Bash / Linux / macOS
npx playwright show-trace "path/to/trace.zip"
```

This opens a local web server and displays the trace in your default browser.

### Option 2: Web Viewer (trace.playwright.dev)

1. Open [trace.playwright.dev](https://trace.playwright.dev) in your browser
2. Drag and drop your `trace.zip` file, or click "Select file" to browse
3. Analyze the trace steps offline in your browser

**NOTE**: The trace viewer loads entirely in your browser and does not transmit any data externally. Your traces remain private.

## Available Scripts

- `npm test` - Run tests without tracing
- `npm run test:trace` - Run tests with tracing enabled (generates trace.zip)
- `npm run show:report` - Open HTML test report
- `npm run show:trace` - Open trace viewer (requires trace file path)

## Configuration

Tracing is configured in `playwright.config.ts`:

```typescript
use: {
  trace: 'on', // Options: 'on', 'retain-on-failure', 'on-first-retry', 'off'
}
```

**Trace Modes:**
- `'on'`: Records trace for every test run (useful for debugging, but generates large files)
- `'retain-on-failure'`: Only keeps traces when tests fail (recommended for CI/CD)
- `'on-first-retry'`: Records trace only when a failed test is retried
- `'off'`: No tracing (default)

## Troubleshooting

### Issue: trace.zip not found

- Make sure you ran `npm run test:trace` (not just `npm test`)
- Check the `test-results/` directory
- Verify tracing is enabled in `playwright.config.ts`

### Issue: Cannot open trace

- Ensure Playwright is installed: `npx playwright install`
- Try the web viewer at [trace.playwright.dev](https://trace.playwright.dev)
- Verify the trace.zip file is not corrupted

## Next Steps

- Modify `tests/smoke.spec.ts` to add your own test scenarios
- Experiment with different trace modes in `playwright.config.ts`
- Integrate tracing into your CI/CD pipeline
- Learn more at [Playwright Documentation](https://playwright.dev)

