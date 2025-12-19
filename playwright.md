# Playwright Project Documentation

## Table of Contents

1. [Introduction to Playwright](#1-introduction-to-playwright)
2. [Project Folder Structure](#2-project-folder-structure)
3. [Programming Languages Used](#3-programming-languages-used)
4. [Architecture Documentation](#4-architecture-documentation)
5. [Libraries &amp; Frameworks](#5-libraries--frameworks)
6. [Module &amp; Function Explanation](#6-module--function-explanation)
7. [Workflow Documentation](#7-workflow-documentation)

---

## 1. Introduction to Playwright

### English Meaning

**Playwright** is a compound word combining "play" and "wright" (meaning "craftsman" or "maker"). In the context of web automation, it represents a tool that crafts or orchestrates browser interactions, much like a playwright crafts a theatrical performance.

### Technical Definition

Playwright is a **framework for Web Testing and Automation** developed by Microsoft. It provides a high-level API to automate web browsers (Chromium, Firefox, and WebKit) with a single, unified interface. Playwright enables cross-browser web automation that is:

- **Ever-green**: Always up-to-date with the latest browser versions
- **Capable**: Supports modern web features and complex scenarios
- **Reliable**: Auto-waiting, web-first assertions, and retry mechanisms eliminate flakiness
- **Fast**: Full test isolation with zero overhead, parallel execution support

### Real-World Analogy

Think of Playwright as a **professional puppeteer** con trolling multiple marionettes (browsers). Just as a puppeteer can:

- Control different types of puppets (different browsers) with the same strings (API)
- Make them perform complex sequences of actions
- Observe and verify their behavior
- Record their performance for later review

Playwright similarly:

- Controls different browsers (Chromium, Firefox, WebKit) with the same API
- Executes complex test scenarios
- Validates web application behavior
- Records traces, screenshots, and videos for debugging

### Benefits of Using Playwright

1. **Cross-Browser Testing**: Test on Chromium, Firefox, and WebKit with a single API
2. **Auto-Waiting**: Automatically waits for elements to be actionable, eliminating flaky tests
3. **Web-First Assertions**: Assertions retry until conditions are met
4. **Full Isolation**: Each test runs in its own browser context (like a fresh browser profile)
5. **Network Control**: Intercept, mock, and modify network requests
6. **Mobile Emulation**: Test mobile viewports and device-specific features
7. **Powerful Tooling**: Codegen, Inspector, and Trace Viewer for debugging
8. **Multi-Language Support**: JavaScript/TypeScript, Python, .NET, and Java
9. **Out-of-Process Execution**: Tests run in separate processes, avoiding typical limitations
10. **Trusted Events**: Uses real browser input pipeline, indistinguishable from real users

### How Playwright Works Internally

Playwright operates using a **client-server architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Script (Node.js)                     │
│                    (Playwright Client)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ WebSocket / Protocol
                       │ (Playwright Protocol)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Playwright Server Process                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Browser Type (Chromium/Firefox/WebKit)             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │ Browser  │  │ Context  │  │   Page   │           │   │
│  │  │ Instance │→ │ Instance │→ │ Instance │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ DevTools Protocol / CDP
                       │ (Browser-specific protocols)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Browser Process (Chromium/Firefox/WebKit)      │
│              (Out-of-Process Execution)                      │
└─────────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **Client Layer**: Test scripts written in TypeScript/JavaScript
2. **Playwright Server**: Manages browser instances, contexts, and pages
3. **Protocol Layer**: Communication via WebSocket using Playwright Protocol
4. **Browser Process**: Actual browser running out-of-process
5. **DevTools Protocol**: Browser-specific communication (CDP for Chromium, etc.)

**Internal Flow:**

1. Test script calls Playwright API (e.g., `page.click()`)
2. Client serializes the command and sends it via WebSocket
3. Server receives command and translates it to browser-specific protocol
4. Browser executes the action
5. Result is sent back through the protocol chain
6. Client receives the result and continues test execution

### Supported Programming Languages

Playwright supports multiple programming languages through language-specific bindings:

| Language                        | Package                      | Status                    |
| ------------------------------- | ---------------------------- | ------------------------- |
| **JavaScript/TypeScript** | `@playwright/test`         | Primary (this repository) |
| **Python**                | `playwright`               | Full support              |
| **.NET (C#)**             | `Microsoft.Playwright`     | Full support              |
| **Java**                  | `com.microsoft.playwright` | Full support              |

This repository contains the **JavaScript/TypeScript** implementation, which serves as the reference implementation for other language bindings.

---

## 2. Project Folder Structure

### Tree Diagram

```
playwright/
├── browser_patches/          # Browser-specific patches and modifications
├── docs/                     # Documentation files
├── examples/                 # Example projects demonstrating Playwright usage
│   ├── github-api/          # GitHub API example
│   ├── mock-battery/        # Battery API mocking example
│   ├── mock-filesystem/     # File system mocking example
│   ├── svgomg/              # SVG optimization example
│   └── todomvc/             # TodoMVC example
├── packages/                 # Monorepo packages (core modules)
│   ├── html-reporter/       # HTML test report generator
│   ├── injected/            # Code injected into browser pages
│   ├── playwright/          # Main Playwright package (includes test runner)
│   ├── playwright-browser-chromium/    # Chromium browser bundle
│   ├── playwright-browser-firefox/     # Firefox browser bundle
│   ├── playwright-browser-webkit/      # WebKit browser bundle
│   ├── playwright-chromium/  # Chromium-specific API
│   ├── playwright-client/   # Client-side utilities
│   ├── playwright-core/     # Core automation engine
│   ├── playwright-ct-core/  # Component testing core
│   ├── playwright-ct-react/ # React component testing
│   ├── playwright-ct-react17/ # React 17 component testing
│   ├── playwright-ct-svelte/ # Svelte component testing
│   ├── playwright-ct-vue/   # Vue component testing
│   ├── playwright-firefox/  # Firefox-specific API
│   ├── playwright-test/     # Test runner package (@playwright/test)
│   ├── playwright-webkit/   # WebKit-specific API
│   ├── protocol/            # Protocol definitions
│   ├── recorder/            # Code generation tool
│   ├── trace/               # Trace utilities
│   ├── trace-viewer/        # Trace viewer UI
│   └── web/                 # Web utilities
├── tests/                   # Test suite for Playwright itself
│   ├── android/             # Android testing tests
│   ├── assets/              # Test assets (HTML, images, etc.)
│   ├── bidi/                # BiDi protocol tests
│   ├── components/          # Component testing tests
│   ├── electron/            # Electron testing tests
│   ├── image_tools/         # Image comparison tests
│   ├── installation/        # Installation tests
│   ├── library/             # Core library tests
│   ├── mcp/                 # Model Context Protocol tests
│   ├── page/                # Page API tests
│   ├── playwright-test/     # Test runner tests
│   └── stress/              # Stress tests
├── utils/                   # Build and utility scripts
│   ├── build/               # Build scripts
│   ├── check_deps.js        # Dependency checker
│   ├── flakiness-dashboard/ # Flakiness tracking
│   └── generate_types/      # Type generation utilities
├── .env                     # Environment variables
├── package.json             # Root package.json (monorepo config)
├── tsconfig.json            # TypeScript configuration
├── eslint.config.mjs        # ESLint configuration
└── README.md                # Project README
```

### Explanation of Each Folder and Its Purpose

#### **browser_patches/**

Contains patches and modifications applied to browser binaries. These patches enable Playwright-specific features and fix browser bugs that affect automation.

#### **docs/**

Documentation files for the project, including API references, guides, and contribution documentation.

#### **examples/**

Example projects demonstrating various Playwright features:

- **github-api/**: Shows how to test REST APIs
- **mock-battery/**: Demonstrates browser API mocking (Battery API)
- **mock-filesystem/**: Shows file system API mocking
- **svgomg/**: Example of testing a web application
- **todomvc/**: Classic TodoMVC example with Playwright tests

#### **packages/** (Monorepo Structure)

This is a **monorepo** using npm workspaces. Each package is independently versioned but shares the same codebase.

**Core Packages:**

- **playwright-core/**: The heart of Playwright - contains browser automation engine, protocol handlers, and server implementation
- **playwright/**: High-level API package that includes the test runner and wraps playwright-core
- **playwright-test/**: The `@playwright/test` package - the test runner framework
- **playwright-client/**: Client-side utilities and web platform abstractions

**Browser Packages:**

- **playwright-chromium/**: Chromium-specific API wrapper
- **playwright-firefox/**: Firefox-specific API wrapper
- **playwright-webkit/**: WebKit-specific API wrapper
- **playwright-browser-*/**: Browser binary bundles for each browser

**Component Testing:**

- **playwright-ct-core/**: Core component testing functionality
- **playwright-ct-react/**: React component testing support
- **playwright-ct-react17/**: React 17 specific support
- **playwright-ct-vue/**: Vue component testing support
- **playwright-ct-svelte/**: Svelte component testing support

**Tooling Packages:**

- **html-reporter/**: Generates HTML test reports
- **trace-viewer/**: UI for viewing test execution traces
- **recorder/**: Code generation tool (Playwright Codegen)
- **protocol/**: Protocol definitions and schemas
- **trace/**: Trace file utilities
- **web/**: Web utilities and shared components

#### **tests/**

Comprehensive test suite for Playwright itself:

- **library/**: Tests for core Playwright library APIs
- **page/**: Tests for Page API
- **playwright-test/**: Tests for the test runner
- **components/**: Tests for component testing features
- **android/**: Tests for Android automation
- **electron/**: Tests for Electron automation
- **bidi/**: Tests for BiDi (Browser Automation Protocol) support
- **mcp/**: Tests for Model Context Protocol integration
- **assets/**: Test fixtures (HTML files, images, etc.)

#### **utils/**

Build and maintenance utilities:

- **build/**: Build scripts for compiling TypeScript, bundling, etc.
- **check_deps.js**: Validates dependency versions
- **generate_types/**: Generates TypeScript type definitions
- **flakiness-dashboard/**: Tracks and reports flaky tests

### Explanation of Each Key File

#### **package.json** (Root)

- Defines monorepo workspace structure
- Contains build scripts (`build`, `test`, `lint`, etc.)
- Lists dev dependencies for the entire project
- Version: `1.58.0-next` (development version)

#### **tsconfig.json** (Root)

- TypeScript configuration for the monorepo
- Defines path aliases (`@html-reporter/*`, `@injected/*`, etc.)
- Sets compilation targets and module system
- Excludes build outputs and specific packages

#### **playwright.config.ts** (Test Configurations)

Multiple test configuration files exist:

- `tests/library/playwright.config.ts`: Main library test configuration
- `tests/playwright-test/playwright.config.ts`: Test runner tests
- `examples/*/playwright.config.ts`: Example project configurations

These define:

- Test directories
- Browser projects (chromium, firefox, webkit)
- Timeouts and retry strategies
- Reporters
- Global fixtures and settings

#### **packages/playwright/src/runner/testRunner.ts**

- Main test runner implementation
- Handles test discovery, execution, and reporting
- Manages workers, file watching, and test lifecycle

#### **packages/playwright/src/common/configLoader.ts**

- Loads and validates Playwright configuration files
- Handles `defineConfig()` function
- Merges multiple config files
- Validates configuration structure

#### **packages/playwright-core/src/server/browser.ts**

- Browser instance management
- Lifecycle management (launch, close, kill)
- Browser process handling

#### **packages/playwright-core/src/server/browserContext.ts**

- Browser context (isolated browser profile) management
- Cookie, storage, and permissions management
- Context lifecycle

#### **packages/playwright-core/src/server/page.ts**

- Page instance management
- Navigation, DOM manipulation, event handling
- Page lifecycle and state management

---

## 3. Programming Languages Used

### Primary Languages

#### **TypeScript** (Primary)

- **Usage**: ~95% of the codebase
- **Where**: All packages in `packages/`, test files in `tests/`
- **Why**:
  - Type safety for complex browser automation APIs
  - Better IDE support and autocomplete
  - Catches errors at compile time
  - Excellent for maintaining a large codebase
- **Files**: `*.ts`, `*.tsx`

#### **JavaScript** (Secondary)

- **Usage**: ~5% of the codebase
- **Where**:
  - Build scripts (`utils/*.js`)
  - Some test utilities
  - Legacy or simple scripts
- **Why**:
  - Simpler scripts don't need TypeScript overhead
  - Some build tools expect JavaScript
- **Files**: `*.js`, `*.mjs`

### Configuration Languages

#### **JSON**

- **Usage**: Package configurations, test data
- **Where**: `package.json`, `tsconfig.json`, test fixtures
- **Why**: Standard format for configuration and data

#### **YAML**

- **Usage**: Protocol definitions, CI configurations
- **Where**: Protocol schemas, GitHub Actions workflows
- **Why**: Human-readable format for structured data

### Markup Languages

#### **Markdown**

- **Usage**: Documentation
- **Where**: `README.md`, `CONTRIBUTING.md`, `docs/`
- **Why**: Standard documentation format

#### **HTML**

- **Usage**: Test fixtures, reporter UIs
- **Where**: `tests/assets/*.html`, `packages/html-reporter/index.html`
- **Why**: Web testing requires HTML test pages

### Styling Languages

#### **CSS**

- **Usage**: UI components for reporters and tools
- **Where**: `packages/html-reporter/src/*.css`, `packages/trace-viewer/src/*.css`
- **Why**: Styling for web-based UIs (HTML reporter, trace viewer)

### Language Distribution by Purpose

| Language   | Purpose                    | Location                                |
| ---------- | -------------------------- | --------------------------------------- |
| TypeScript | Core implementation, tests | `packages/**/*.ts`, `tests/**/*.ts` |
| JavaScript | Build scripts, utilities   | `utils/*.js`, some test files         |
| JSON       | Configuration, data        | `package.json`, test fixtures         |
| YAML       | Protocol schemas           | `packages/protocol/**/*.yml`          |
| Markdown   | Documentation              | `*.md` files                          |
| HTML       | Test fixtures, UIs         | `tests/assets/*.html`, reporter UIs   |
| CSS        | UI styling                 | Reporter and viewer packages            |

---

## 4. Architecture Documentation

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Test Script                         │
│                   (TypeScript/JavaScript)                       │
│                    import { test } from                        │
│                    '@playwright/test'                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    @playwright/test                             │
│              (Test Runner Framework)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Test Runner  │  │  Config      │  │  Reporter    │         │
│  │              │  │  Loader      │  │  System      │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
│         └─────────────────┼──────────────────┘                 │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    playwright (Main Package)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Worker     │  │  Transform   │  │   Plugins    │         │
│  │   Manager    │  │  System      │  │   System     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
└─────────┼─────────────────┼──────────────────┼──────────────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    playwright-core                              │
│              (Browser Automation Engine)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Client     │  │   Server     │  │   Protocol   │         │
│  │   Layer      │  │   Layer      │  │   Handlers   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
│         └─────────────────┼──────────────────┘                 │
│                           │                                    │
│  ┌──────────────────────────────────────────────┐             │
│  │         Browser Type Implementations         │             │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │             │
│  │  │Chromium  │  │ Firefox  │  │ WebKit   │   │             │
│  │  │  Impl    │  │  Impl    │  │  Impl    │   │             │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘   │             │
│  └───────┼─────────────┼─────────────┼─────────┘             │
│          │             │             │                        │
└──────────┼─────────────┼─────────────┼────────────────────────┘
           │             │             │
           │  WebSocket  │  WebSocket  │  WebSocket
           │  (CDP)      │  (Custom)   │  (Custom)
           ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Browser Processes (Out-of-Process)                 │
│  ┌──────────┐          ┌──────────┐          ┌──────────┐      │
│  │Chromium  │          │ Firefox  │          │ WebKit   │      │
│  │ Process  │          │ Process  │          │ Process  │      │
│  └──────────┘          └──────────┘          └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

### Module-Level Architecture

#### **1. Test Runner Layer** (`packages/playwright/src/runner/`)

```
testRunner.ts
├── Test discovery and loading
├── Worker management
├── Test execution orchestration
├── File watching
└── Event emission

tasks.ts
├── Task creation (load, run, report)
├── Task execution pipeline
└── Task cleanup

worker/
├── Worker process management
├── Test file execution
└── Fixture resolution
```

#### **2. Configuration Layer** (`packages/playwright/src/common/`)

```
configLoader.ts
├── Config file discovery
├── Config validation
├── Config merging
└── defineConfig() implementation

config.ts
├── Config type definitions
├── Default values
└── Config transformation
```

#### **3. Core Automation Layer** (`packages/playwright-core/src/server/`)

```
playwright.ts
├── Playwright instance creation
└── Browser type registration

browserType.ts
├── Browser launch logic
├── Executable path resolution
└── Browser server management

browser.ts
├── Browser instance lifecycle
├── Browser process management
└── Context creation

browserContext.ts
├── Context lifecycle
├── Cookie/storage management
├── Permissions management
└── Page creation

page.ts
├── Page lifecycle
├── Navigation management
├── DOM interaction
├── Event handling
└── Evaluation
```

#### **4. Protocol Layer** (`packages/playwright-core/src/`)

```
client/
├── Client-side API
├── Connection management
└── Command serialization

server/
├── Server-side handlers
├── Protocol translation
└── Browser communication

protocol/
├── Protocol definitions
├── Message schemas
└── Validation
```

#### **5. Browser-Specific Implementations**

```
chromium/
├── ChromiumBrowser
├── ChromiumBrowserContext
├── ChromiumPage
└── CDP protocol handlers

firefox/
├── FirefoxBrowser
├── FirefoxBrowserContext
├── FirefoxPage
└── Custom protocol handlers

webkit/
├── WebKitBrowser
├── WebKitBrowserContext
├── WebKitPage
└── Custom protocol handlers
```

### Component Relationships

```
┌─────────────┐
│   Test      │
│   Script    │
└──────┬──────┘
       │
       │ 1. Calls test() function
       ▼
┌─────────────┐
│ Test Runner │◄─────┐
└──────┬──────┘      │
       │             │
       │ 2. Discovers │ 5. Reports results
       │    tests     │
       ▼             │
┌─────────────┐      │
│   Config    │      │
│   Loader    │      │
└──────┬──────┘      │
       │             │
       │ 3. Loads    │
       │    config   │
       ▼             │
┌─────────────┐      │
│   Worker    │      │
│   Manager   │      │
└──────┬──────┘      │
       │             │
       │ 4. Executes │
       │    tests    │
       ▼             │
┌─────────────┐      │
│   Fixture   │      │
│   Resolver  │      │
└──────┬──────┘      │
       │             │
       │ 6. Creates  │
       │    fixtures │
       ▼             │
┌─────────────┐      │
│  Playwright │      │
│   Core      │      │
└──────┬──────┘      │
       │             │
       │ 7. Launches │
       │    browser  │
       ▼             │
┌─────────────┐      │
│   Browser   │──────┘
│   Process   │
└─────────────┘
```

### Data Flow

#### **Test Execution Flow**

```
1. User writes test
   └─> test('example', async ({ page }) => { ... })

2. Test Runner discovers test files
   └─> Scans testDir for *.spec.ts files

3. Config is loaded
   └─> Loads playwright.config.ts
   └─> Merges with CLI overrides
   └─> Validates configuration

4. Workers are spawned
   └─> Creates worker processes (based on workers config)
   └─> Each worker gets a subset of tests

5. Fixtures are resolved
   └─> Resolves { page } fixture
   └─> Creates browser context
   └─> Creates page instance

6. Test executes
   └─> page.goto() → Protocol command → Browser
   └─> Browser response → Protocol → Test

7. Assertions run
   └─> expect() → Auto-retry → Validation

8. Results collected
   └─> Test result → Reporter → Output
```

#### **Browser Communication Flow**

```
Test Script
    │
    │ page.click('button')
    ▼
Playwright Client
    │
    │ Serialize: { method: 'click', selector: 'button' }
    ▼
WebSocket Connection
    │
    │ Send message
    ▼
Playwright Server
    │
    │ Translate to browser protocol
    ▼
Browser Protocol (CDP/Custom)
    │
    │ Execute action
    ▼
Browser Process
    │
    │ Action result
    ▼
Browser Protocol
    │
    │ Response
    ▼
Playwright Server
    │
    │ Deserialize response
    ▼
WebSocket Connection
    │
    │ Return result
    ▼
Playwright Client
    │
    │ Resolve promise
    ▼
Test Script
```

### Control Flow

#### **Test Runner Control Flow**

```
Main Process
│
├─> Load Config
│   └─> Validate
│   └─> Merge overrides
│
├─> Discover Tests
│   └─> Scan testDir
│   └─> Filter by grep/projects
│
├─> Create Workers
│   └─> Spawn worker processes
│   └─> Assign tests to workers
│
└─> Execute Tests (Parallel)
    │
    ├─> Worker 1
    │   ├─> Load test file
    │   ├─> Resolve fixtures
    │   ├─> Run beforeEach hooks
    │   ├─> Execute test
    │   ├─> Run afterEach hooks
    │   └─> Cleanup fixtures
    │
    ├─> Worker 2
    │   └─> (Same flow)
    │
    └─> Worker N
        └─> (Same flow)
```

#### **Fixture Resolution Control Flow**

```
Test Function
│
│ async ({ page, context }) => { ... }
│
▼
Fixture Resolver
│
├─> Check fixture dependencies
│   └─> page depends on context
│   └─> context depends on browser
│
├─> Resolve in dependency order
│   ├─> 1. browser (from browserType.launch())
│   ├─> 2. context (from browser.newContext())
│   └─> 3. page (from context.newPage())
│
└─> Inject into test function
```

---

## 5. Libraries & Frameworks

### Core Dependencies

#### **TypeScript** (`^5.9.2`)

- **Purpose**: Type-safe JavaScript development
- **Where Used**: Entire codebase compilation
- **Why Required**: Provides static typing, better IDE support, and compile-time error checking for a large, complex codebase

#### **Node.js** (`>=18`)

- **Purpose**: Runtime environment
- **Where Used**: All Node.js processes (test runner, server, workers)
- **Why Required**: Playwright is a Node.js-based tool; requires Node.js 18+ for modern features

### Build & Development Tools

#### **esbuild** (`^0.25.0`)

- **Purpose**: Fast JavaScript/TypeScript bundler
- **Where Used**: Building browser bundles, utilities
- **Why Required**: Fast compilation for development and production builds

#### **Vite** (`^6.4.1`)

- **Purpose**: Build tool for UI components
- **Where Used**: HTML reporter, trace viewer, recorder UIs
- **Why Required**: Fast development server and optimized production builds for web UIs

#### **ESLint** (`^9.34.0`)

- **Purpose**: Code linting and quality
- **Where Used**: All TypeScript/JavaScript files
- **Why Required**: Enforces code style and catches potential bugs

#### **@typescript-eslint/*** (`^8.41.0`)

- **Purpose**: TypeScript-specific ESLint rules
- **Where Used**: TypeScript files
- **Why Required**: TypeScript-aware linting rules

### Testing & Quality

#### **@playwright/test** (Self-dependency)

- **Purpose**: Testing Playwright itself
- **Where Used**: All test files in `tests/`
- **Why Required**: Playwright uses its own test framework to test itself (dogfooding)

### Protocol & Communication

#### **ws** (`^8.17.1`)

- **Purpose**: WebSocket client/server
- **Where Used**: Browser communication, remote connections
- **Why Required**: WebSocket is the transport for Playwright Protocol

#### **chromium-bidi** (`^11.0.0`)

- **Purpose**: Browser Automation Protocol (BiDi) support
- **Where Used**: BiDi protocol implementation
- **Why Required**: Future-proofing for W3C Browser Automation Protocol

### Utilities

#### **zod** (`^3.25.76`)

- **Purpose**: Schema validation
- **Where Used**: Configuration validation, protocol validation
- **Why Required**: Runtime type validation for configs and protocol messages

#### **chokidar** (`^3.5.3`)

- **Purpose**: File system watching
- **Where Used**: Test file watching, config file watching
- **Why Required**: Efficient file watching for watch mode

#### **colors** (`^1.4.0`)

- **Purpose**: Terminal colors
- **Where Used**: CLI output, reporters
- **Why Required**: Better UX with colored terminal output

### UI Libraries (For Tools)

#### **React** (`^19.2.1`)

- **Purpose**: UI framework
- **Where Used**: HTML reporter, trace viewer
- **Why Required**: Modern, component-based UI for web tools

#### **React DOM** (`^19.2.1`)

- **Purpose**: React rendering
- **Where Used**: HTML reporter, trace viewer
- **Why Required**: Renders React components to DOM

### Image Processing

#### **ssim.js** (`^3.5.0`)

- **Purpose**: Structural Similarity Index (SSIM) for image comparison
- **Where Used**: Screenshot comparison, visual testing
- **Why Required**: Advanced image comparison algorithm for visual regression testing

### Other Utilities

#### **concurrently** (`^6.2.1`)

- **Purpose**: Run multiple commands concurrently
- **Where Used**: Build scripts, lint scripts
- **Why Required**: Parallel execution of build/lint tasks

#### **dotenv** (`^16.4.5`)

- **Purpose**: Environment variable loading
- **Where Used**: Test configurations
- **Why Required**: Loads `.env` files for test configuration

#### **yaml** (`2.6.0`)

- **Purpose**: YAML parsing
- **Where Used**: Protocol schema files
- **Why Required**: Parses YAML protocol definitions

### Dependency Categories

| Category                | Libraries                | Purpose                    |
| ----------------------- | ------------------------ | -------------------------- |
| **Core Runtime**  | Node.js, TypeScript      | Execution environment      |
| **Build Tools**   | esbuild, Vite            | Compilation and bundling   |
| **Code Quality**  | ESLint, TypeScript       | Linting and type checking  |
| **Communication** | ws, chromium-bidi        | Protocol and networking    |
| **Validation**    | zod                      | Runtime validation         |
| **UI Frameworks** | React, React DOM         | Web-based tools            |
| **Utilities**     | chokidar, colors, dotenv | File watching, CLI, config |
| **Testing**       | @playwright/test         | Self-testing               |

---

## 6. Module & Function Explanation

This section provides detailed explanations of key modules, their purposes, internal logic, inputs/outputs, dependencies, and how they contribute to the overall workflow.

### 6.1 Test Runner Module (`packages/playwright/src/runner/testRunner.ts`)

**Purpose**: The central orchestrator for test execution, managing the entire test lifecycle from configuration loading to test execution and reporting.

**Key Components**:

#### `TestRunner` Class

**Purpose**: Main entry point for test execution operations.

**Key Methods**:

- **`constructor(configLocation, configCLIOverrides)`**

  - **Inputs**: Configuration file location and CLI overrides
  - **Outputs**: Initialized TestRunner instance
  - **Dependencies**: `Watcher` for file watching, `EventEmitter` for event handling
  - **Logic**: Sets up file watcher and event emitters for test file changes
- **`loadConfig()`**

  - **Inputs**: None (uses internal config location)
  - **Outputs**: `FullConfigInternal` object
  - **Dependencies**: `configLoader.loadConfig()`
  - **Logic**: Loads and validates Playwright configuration from file system
  - **Contribution**: Provides configuration to all downstream operations
- **`runTests(userReporter, params)`**

  - **Inputs**:
    - `userReporter`: Reporter instance for output
    - `params`: `RunTestsParams` containing test locations, filters, options
  - **Outputs**: `{ status: FullResultStatus }`
  - **Dependencies**: `_innerRunTests()`, `createRunTestsTasks()`, `TestRun`
  - **Logic**:
    1. Stops any running tests
    2. Merges CLI overrides with config
    3. Creates test run with tasks
    4. Executes tasks sequentially
    5. Returns final status
  - **Contribution**: Orchestrates the entire test execution workflow
- **`listTests(userReporter, params)`**

  - **Inputs**: Reporter and listing parameters (locations, grep, projects)
  - **Outputs**: Test listing status
  - **Dependencies**: `createLoadTask()`, `createReportBeginTask()`
  - **Logic**: Loads test files without executing them, useful for discovery
  - **Contribution**: Enables test discovery and listing features
- **`runGlobalSetup(userReporters)`**

  - **Inputs**: Array of reporter instances
  - **Outputs**: `{ status, env }` - setup status and environment changes
  - **Dependencies**: `createGlobalSetupTasks()`, `TestRun`
  - **Logic**: Executes global setup hooks before test execution
  - **Contribution**: Handles one-time setup operations

### 6.2 Configuration Loader Module (`packages/playwright/src/common/configLoader.ts`)

**Purpose**: Loads, validates, and merges Playwright configuration from various sources.

**Key Functions**:

- **`loadConfig(location, overrides, metadata)`**

  - **Inputs**:
    - `location`: Config file location
    - `overrides`: CLI/config overrides
    - `metadata`: Optional metadata
  - **Outputs**: `FullConfigInternal` with merged configuration
  - **Dependencies**: `requireOrImport()`, `defineConfig()`, TypeScript loader
  - **Logic**:
    1. Resolves config file path
    2. Loads user config (supports JS/TS/ESM)
    3. Applies CLI overrides
    4. Validates and normalizes configuration
    5. Merges project configurations
    6. Returns complete config object
  - **Contribution**: Provides unified configuration to all test operations
- **`defineConfig(...configs)`**

  - **Inputs**: One or more config objects
  - **Outputs**: Merged configuration object
  - **Dependencies**: None
  - **Logic**: Deep merges multiple config objects, handling projects specially
  - **Contribution**: Enables config composition and inheritance

### 6.3 Task System Module (`packages/playwright/src/runner/tasks.ts`)

**Purpose**: Defines and executes test run tasks in a structured, sequential manner.

**Key Components**:

- **`TestRun` Class**

  - **Purpose**: Container for test execution state
  - **Properties**: `config`, `reporter`, `rootSuite`, `projectFiles`, `failureTracker`
  - **Contribution**: Maintains execution context across tasks
- **`runTasks(testRun, tasks, globalTimeout, cancelPromise)`**

  - **Inputs**:
    - `testRun`: TestRun instance
    - `tasks`: Array of Task objects
    - `globalTimeout`: Optional timeout
    - `cancelPromise`: Optional cancellation promise
  - **Outputs**: Final status ('passed', 'failed', 'interrupted', 'timedout')
  - **Dependencies**: Individual task `setup()` and `teardown()` methods
  - **Logic**:
    1. Executes each task's `setup()` sequentially
    2. If setup fails, runs teardown for completed tasks
    3. Returns final status
  - **Contribution**: Provides structured execution pipeline

**Task Factory Functions**:

- **`createGlobalSetupTasks(config)`**

  - **Purpose**: Creates tasks for global setup
  - **Outputs**: Array of setup tasks
  - **Logic**: Creates tasks for output dir cleanup, plugin setup, global hooks
  - **Contribution**: Handles pre-test initialization
- **`createRunTestsTasks(config)`**

  - **Purpose**: Creates tasks for test execution
  - **Outputs**: Array of test execution tasks
  - **Logic**: Creates tasks for phases, reporting, plugin begin, test running
  - **Contribution**: Orchestrates test execution phase
- **`createLoadTask(mode, options)`**

  - **Purpose**: Creates task for loading test files
  - **Inputs**:
    - `mode`: 'out-of-process' or 'in-process'
    - `options`: Loading options (filterOnly, failOnLoadErrors, etc.)
  - **Outputs**: Task object
  - **Logic**:
    1. Collects test files from projects
    2. Loads test file suites
    3. Applies filters (changed files, test list, etc.)
    4. Creates root suite structure
  - **Contribution**: Discovers and loads all test files

### 6.4 Worker Module (`packages/playwright/src/worker/workerMain.ts`)

**Purpose**: Executes tests in isolated worker processes, handling fixture lifecycle and test execution.

**Key Components**:

#### `WorkerMain` Class

**Purpose**: Main worker process entry point that runs tests in isolation.

**Key Methods**:

- **`constructor(params)`**

  - **Inputs**: `WorkerInitParams` (worker index, parallel index, etc.)
  - **Outputs**: Initialized WorkerMain instance
  - **Dependencies**: `FixtureRunner`, `ProcessRunner`
  - **Logic**:
    1. Sets up worker environment variables
    2. Initializes fixture runner
    3. Intercepts stdout/stderr for test output capture
    4. Sets up error handlers
  - **Contribution**: Provides isolated execution environment
- **`runTestGroup(params)`**

  - **Inputs**: `RunTestGroupParams` (test group, config, project)
  - **Outputs**: Test results for the group
  - **Dependencies**: `FixtureRunner`, `loadTestFile()`, `TestInfoImpl`
  - **Logic**:
    1. Loads config and project
    2. Sets up fixture pool
    3. For each test in group:
       - Sets up worker-scope fixtures
       - Executes suite hooks (beforeAll)
       - Runs test with fixtures
       - Executes suite hooks (afterAll)
       - Tears down fixtures
    4. Returns results
  - **Contribution**: Executes actual test code in isolated process
- **`gracefullyClose()`**

  - **Purpose**: Cleanup worker resources
  - **Logic**: Tears down fixtures, closes browsers, collects errors
  - **Contribution**: Ensures proper cleanup on worker shutdown

### 6.5 Fixture Runner Module (`packages/playwright/src/worker/fixtureRunner.ts`)

**Purpose**: Manages fixture lifecycle (setup, teardown, dependencies) for tests.

**Key Components**:

#### `FixtureRunner` Class

**Purpose**: Handles fixture dependency resolution and execution.

**Key Methods**:

- **`setupScope(scope, testInfo, runnable)`**

  - **Inputs**:
    - `scope`: 'test' or 'worker'
    - `testInfo`: Test information object
    - `runnable`: Runnable description
  - **Outputs**: Promise resolving when setup complete
  - **Dependencies**: `FixturePool`, `Fixture` instances
  - **Logic**:
    1. Resolves fixture dependencies (topological sort)
    2. Sets up each fixture in dependency order
    3. Handles fixture failures
  - **Contribution**: Provides fixtures to tests (page, context, etc.)
- **`teardownScope(scope, testInfo, runnable)`**

  - **Purpose**: Tears down fixtures in reverse dependency order
  - **Logic**: Recursively tears down fixtures, handling errors
  - **Contribution**: Ensures proper cleanup after tests

#### `Fixture` Class

**Purpose**: Represents a single fixture instance.

**Properties**:

- `registration`: Fixture definition
- `value`: Resolved fixture value
- `_deps`: Dependencies of this fixture
- `_usages`: Fixtures that depend on this one

**Methods**:

- **`setup(testInfo, runnable)`**: Sets up fixture and dependencies
- **`teardown()`**: Tears down fixture

### 6.6 Browser Module (`packages/playwright-core/src/server/browser.ts`)

**Purpose**: Represents a browser instance and manages browser contexts.

**Key Components**:

#### `Browser` Class (Abstract)

**Purpose**: Base class for browser implementations (Chromium, Firefox, WebKit).

**Key Methods**:

- **`newContext(progress, options)`**

  - **Inputs**:
    - `progress`: Progress controller
    - `options`: BrowserContextOptions (viewport, permissions, etc.)
  - **Outputs**: `BrowserContext` instance
  - **Dependencies**: `doCreateNewContext()` (browser-specific)
  - **Logic**:
    1. Validates context options
    2. Handles client certificates if needed
    3. Creates context via browser-specific implementation
    4. Sets storage state
    5. Emits context event
  - **Contribution**: Creates isolated browser contexts for tests
- **`newContextForReuse(progress, params)`**

  - **Purpose**: Creates or reuses context for faster test execution
  - **Logic**: Checks if existing context can be reused, otherwise creates new
  - **Contribution**: Optimizes test execution speed

### 6.7 Browser Context Module (`packages/playwright-core/src/server/browserContext.ts`)

**Purpose**: Represents an isolated browser context (like an incognito window).

**Key Components**:

#### `BrowserContext` Class (Abstract)

**Purpose**: Manages pages, network, storage, and context-level settings.

**Key Methods**:

- **`constructor(browser, options, browserContextId)`**

  - **Inputs**: Browser instance, options, optional context ID
  - **Outputs**: Initialized context
  - **Dependencies**: `Selectors`, `Tracing`, `Clock`, `DialogManager`
  - **Logic**: Initializes context with selectors, tracing, clock, dialogs
  - **Contribution**: Sets up isolated browsing environment
- **`_initialize()`**

  - **Purpose**: Sets up debugger, inspector, and init scripts
  - **Logic**:
    1. Creates debugger instance
    2. Shows inspector if in debug mode
    3. Sets up console API if needed
    4. Blocks service workers if configured
  - **Contribution**: Enables debugging and development features
- **`newPage()`**

  - **Inputs**: None
  - **Outputs**: `Page` instance
  - **Dependencies**: Browser-specific page creation
  - **Logic**: Creates new page in this context
  - **Contribution**: Provides page objects for tests

### 6.8 Page Module (`packages/playwright-core/src/server/page.ts`)

**Purpose**: Represents a single browser page/tab with DOM and interaction capabilities.

**Key Components**:

#### `Page` Class

**Purpose**: Main interface for page interactions (navigation, clicks, assertions).

**Key Methods**:

- **`goto(url, options)`**

  - **Inputs**: URL and navigation options (timeout, waitUntil, etc.)
  - **Outputs**: `Response` object
  - **Dependencies**: `PageDelegate.navigateFrame()`
  - **Logic**:
    1. Waits for navigation to start
    2. Waits for navigation to complete (based on waitUntil)
    3. Returns response
  - **Contribution**: Enables page navigation in tests
- **`click(selector, options)`**

  - **Inputs**: Selector and click options
  - **Outputs**: Promise resolving when click complete
  - **Dependencies**: `Locator`, `input.Mouse`
  - **Logic**:
    1. Resolves selector to element
    2. Waits for element to be actionable
    3. Scrolls element into view
    4. Performs click action
  - **Contribution**: Enables user interaction simulation
- **`screenshot(options)`**

  - **Inputs**: Screenshot options (path, fullPage, clip, etc.)
  - **Outputs**: Buffer with image data
  - **Dependencies**: `Screenshotter`, `PageDelegate.takeScreenshot()`
  - **Logic**:
    1. Validates options
    2. Determines screenshot area
    3. Takes screenshot via browser
    4. Returns image buffer
  - **Contribution**: Enables visual testing and debugging

### 6.9 Reporter Module (`packages/playwright/src/reporters/base.ts`)

**Purpose**: Handles test result reporting and output formatting.

**Key Components**:

- **`InternalReporter` Class**

  - **Purpose**: Wraps user reporters and provides internal reporting
  - **Methods**: `onBegin()`, `onTestBegin()`, `onTestEnd()`, `onEnd()`
  - **Contribution**: Formats and outputs test results
- **`terminalScreen` Object**

  - **Purpose**: Manages terminal output formatting
  - **Properties**: `colors`, `isTTY`, `ttyWidth`, `ttyHeight`
  - **Contribution**: Provides formatted console output

### 6.10 Module Dependencies Diagram

```
TestRunner
    ├──> ConfigLoader (loads configuration)
    ├──> Task System (orchestrates execution)
    │       ├──> Load Task (discovers tests)
    │       ├──> Run Tests Task (executes tests)
    │       └──> Report Task (generates reports)
    ├──> WorkerHost (spawns workers)
    │       └──> WorkerMain (runs tests)
    │               ├──> FixtureRunner (manages fixtures)
    │               └──> TestInfo (test metadata)
    └──> Reporter (outputs results)

WorkerMain
    └──> Browser (creates browser instances)
            └──> BrowserContext (isolated contexts)
                    └──> Page (individual pages)
```

---

## 7. Workflow Documentation

This section documents the step-by-step workflow of how Playwright executes tests, from initialization to report generation.

### 7.1 Test Runner Startup

**Step 1: CLI Entry Point**

- User runs `playwright test` command
- CLI (`packages/playwright/cli.js`) parses arguments
- Determines operation mode (test, list, show-report, etc.)
- Creates `TestRunner` instance with config location

**Step 2: TestRunner Initialization**

```typescript
// Location: packages/playwright/src/runner/testRunner.ts
constructor(configLocation, configCLIOverrides) {
  this.configLocation = configLocation;
  this._configCLIOverrides = configCLIOverrides;
  this._watcher = new Watcher(...); // File watching
}
```

**Step 3: Environment Setup**

- Sets `PWTEST_UNDER_TEST` environment variable
- Initializes file watcher for test file changes
- Sets up event emitters for test lifecycle events

### 7.2 Configuration Loading

**Step 1: Config File Resolution**

```typescript
// Location: packages/playwright/src/common/configLoader.ts
async function loadUserConfig(location: ConfigLocation) {
  // Resolves config file path (playwright.config.ts/js/mjs)
  // Supports TypeScript, JavaScript, ESM modules
}
```

**Step 2: Config File Loading**

- Reads config file from filesystem
- If TypeScript: Compiles using TypeScript loader
- If ESM: Uses ESM loader
- Executes config file to get config object

**Step 3: Config Merging**

- Merges user config with CLI overrides
- Applies project configurations
- Validates required fields
- Normalizes paths and options

**Step 4: Config Validation**

- Validates browser configurations
- Checks project settings
- Verifies reporter configurations
- Validates timeout and retry settings

**Result**: `FullConfigInternal` object with complete configuration

### 7.3 Browser Launch Process

**Step 1: Browser Type Selection**

- Determines browser from project config (`chromium`, `firefox`, `webkit`)
- Resolves browser executable path from registry
- Checks if browser is installed

**Step 2: Browser Launch Options**

```typescript
// Location: packages/playwright-core/src/server/browserType.ts
launch(options) {
  // Validates launch options
  // Sets up browser process
  // Connects via DevTools Protocol
}
```

**Step 3: Browser Process Creation**

- Spawns browser process with arguments
- Sets up communication channel (WebSocket or stdio)
- Waits for browser to be ready
- Establishes protocol connection

**Step 4: Browser Instance Creation**

```typescript
// Location: packages/playwright-core/src/server/browser.ts
const browser = new Browser(parent, options);
// Creates browser abstraction
// Sets up event handlers
// Initializes browser-specific features
```

**Result**: Running browser instance ready for context creation

### 7.4 Hooks & Fixtures Execution

**Step 1: Global Setup Hooks**

```typescript
// Location: packages/playwright/src/runner/tasks.ts
createGlobalSetupTasks(config) {
  // Creates tasks for:
  // - Output directory cleanup
  // - Plugin setup
  // - Global setup hooks (globalSetup)
}
```

**Execution Order**:

1. Output directory cleanup (if not preserving)
2. Plugin setup (each plugin's `setup()` method)
3. Global teardown registration (reverse order for cleanup)
4. Global setup execution (user-defined `globalSetup`)

**Step 2: Worker-Scope Fixtures**

```typescript
// Location: packages/playwright/src/worker/fixtureRunner.ts
async setupScope('worker', testInfo, runnable) {
  // Sets up worker-scope fixtures:
  // - Browser instance
  // - Custom worker fixtures
  // - Shared resources
}
```

**Fixture Resolution**:

1. Builds dependency graph from fixture definitions
2. Topologically sorts fixtures by dependencies
3. Sets up each fixture in order:
   - Resolves dependencies first
   - Calls fixture function
   - Stores fixture value
4. Handles fixture failures (marks dependent fixtures as failed)

**Step 3: Test-Scope Fixtures**

- Executed before each test
- Includes built-in fixtures (`page`, `context`, `browser`)
- Includes user-defined test fixtures
- Same dependency resolution process

**Step 4: Suite Hooks (beforeAll/afterAll)**

```typescript
// Location: packages/playwright/src/worker/workerMain.ts
// beforeAll hooks run before first test in suite
// afterAll hooks run after last test in suite
```

### 7.5 Test Execution Lifecycle

**Step 1: Test Discovery**

```typescript
// Location: packages/playwright/src/runner/tasks.ts
createLoadTask() {
  // 1. Collects test files from testDir
  // 2. Filters by testMatch pattern
  // 3. Loads each test file
  // 4. Parses test declarations
  // 5. Creates test suite tree
}
```

**Test File Loading**:

- Compiles TypeScript/JavaScript files
- Executes test files in isolated context
- Collects `test()` and `test.describe()` calls
- Builds test suite hierarchy

**Step 2: Test Filtering**

- Applies CLI filters (grep, locations, projects)
- Filters by tags
- Applies changed file filters (if enabled)
- Filters by test list (if provided)

**Step 3: Test Grouping**

```typescript
// Location: packages/playwright/src/runner/testGroups.ts
createTestGroups(projectSuite, expectedParallelism) {
  // Groups tests for parallel execution
  // Considers test dependencies
  // Balances test execution time
}
```

**Step 4: Worker Assignment**

- Creates worker processes (based on `workers` config)
- Assigns test groups to workers
- Sets up IPC communication

**Step 5: Test Execution in Worker**

```typescript
// Location: packages/playwright/src/worker/workerMain.ts
async runTestGroup(params) {
  for (const test of testGroup.tests) {
    // 1. Setup test-scope fixtures
    // 2. Run beforeAll hooks (if first test in suite)
    // 3. Create TestInfo object
    // 4. Execute test function
    // 5. Run afterAll hooks (if last test in suite)
    // 6. Teardown test-scope fixtures
  }
}
```

**Test Function Execution**:

1. **Fixture Setup**: Resolves and sets up test fixtures
2. **Test Info Creation**: Creates `TestInfo` with metadata
3. **Before Hooks**: Runs `beforeEach` hooks
4. **Test Execution**:
   - Executes test function body
   - Captures assertions
   - Handles timeouts
   - Records steps
5. **After Hooks**: Runs `afterEach` hooks
6. **Fixture Teardown**: Tears down fixtures in reverse order

**Step 6: Test Result Collection**

- Collects test status (passed, failed, skipped, timedout)
- Captures errors and stack traces
- Records test duration
- Collects attachments (screenshots, videos, traces)

### 7.6 Assertions & Error Flows

**Step 1: Assertion Execution**

```typescript
// Location: packages/playwright/src/matchers/
expect(locator).toHaveText(expected) {
  // 1. Resolves locator to element
  // 2. Waits for element to be stable
  // 3. Gets element text
  // 4. Compares with expected value
  // 5. Retries if not matching (with timeout)
  // 6. Throws error if assertion fails
}
```

**Auto-Waiting**:

- Playwright automatically waits for elements to be actionable
- Waits for network idle (if configured)
- Waits for animations to complete
- Retries assertions until timeout

**Step 2: Error Handling**

```typescript
// Location: packages/playwright/src/worker/testInfo.ts
try {
  await testFunction();
} catch (error) {
  // Captures error
  // Adds to test.errors array
  // Marks test as failed
  // Continues with cleanup
}
```

**Error Types**:

- **Test Errors**: Failures in test code
- **Timeout Errors**: Test exceeded timeout
- **Fixture Errors**: Failures in fixture setup/teardown
- **Hook Errors**: Failures in beforeAll/afterAll/beforeEach/afterEach

**Step 3: Error Reporting**

- Formats error message and stack trace
- Captures error location (file, line, column)
- Adds error to test result
- Reports to all configured reporters

**Step 4: Retry Logic**

```typescript
// Location: packages/playwright/src/runner/testRunner.ts
// If test fails and retries > 0:
// 1. Marks test for retry
// 2. Tears down fixtures
// 3. Sets up fixtures again
// 4. Re-executes test
// 5. Repeats until passed or retries exhausted
```

### 7.7 Trace / Screenshot / Logs Generation

**Step 1: Tracing Setup**

```typescript
// Location: packages/playwright-core/src/server/trace/
// Tracing is configured in test options
tracing.start() {
  // Starts recording:
  // - Network requests/responses
  // - DOM snapshots
  // - Screenshots
  // - Console logs
  // - User actions
}
```

**Trace Recording**:

- Records all page interactions
- Captures network activity
- Takes DOM snapshots at key points
- Records console messages
- Stores action logs

**Step 2: Screenshot Capture**

```typescript
// Location: packages/playwright-core/src/server/screenshotter.ts
async screenshot(options) {
  // 1. Validates screenshot options
  // 2. Determines screenshot area (viewport, full page, element)
  // 3. Takes screenshot via browser
  // 4. Saves to file or returns buffer
}
```

**Screenshot Triggers**:

- On test failure (if configured)
- On assertion failure (for visual tests)
- Manual `page.screenshot()` calls
- Trace viewer snapshots

**Step 3: Video Recording**

```typescript
// Location: packages/playwright-core/src/server/videoRecorder.ts
// Video recording starts with context creation
// Records all page activity
// Stops on context close
// Saves video file to output directory
```

**Step 4: Log Collection**

- Intercepts `console.log`, `console.error`, etc.
- Captures stdout/stderr from test process
- Associates logs with test execution
- Stores in trace or test result

**Step 5: Artifact Storage**

- Saves traces to `test-results/` directory
- Saves screenshots to test output directory
- Saves videos to test output directory
- Organizes by test file and test name

### 7.8 Report Generation

**Step 1: Reporter Initialization**

```typescript
// Location: packages/playwright/src/reporters/
// Reporters are initialized from config
const reporters = createReporters(config.reporter);
// Supports: list, dot, json, html, junit, etc.
```

**Step 2: Report Begin**

```typescript
reporter.onBegin(config, rootSuite) {
  // Called once at start
  // Receives full config and test suite tree
  // Initializes report structure
}
```

**Step 3: Test Result Reporting**

```typescript
// For each test:
reporter.onTestBegin(test) {
  // Called when test starts
}

reporter.onTestEnd(test, result) {
  // Called when test finishes
  // Receives test result with status, errors, duration
}
```

**Step 4: Report End**

```typescript
reporter.onEnd(result) {
  // Called after all tests complete
  // Receives full result with:
  // - Total tests
  // - Passed/failed/skipped counts
  // - Duration
  // - Status
}
```

**Step 5: Report Output**

**HTML Reporter**:

- Generates interactive HTML report
- Includes test results, errors, traces
- Links to screenshots and videos
- Opens in browser (if configured)

**JSON Reporter**:

- Outputs machine-readable JSON
- Contains all test data
- Used for CI/CD integration

**JUnit Reporter**:

- Generates XML in JUnit format
- Compatible with CI systems
- Includes test metadata

**List Reporter**:

- Outputs formatted text to console
- Shows test progress
- Displays failures and summary

### 7.9 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CLI Entry Point                                          │
│    - Parse arguments                                        │
│    - Create TestRunner                                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Configuration Loading                                     │
│    - Resolve config file                                    │
│    - Load and merge config                                  │
│    - Validate configuration                                 │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Global Setup                                             │
│    - Clean output directories                                │
│    - Setup plugins                                           │
│    - Run globalSetup hooks                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Test Discovery                                           │
│    - Collect test files                                     │
│    - Load test suites                                       │
│    - Apply filters                                          │
│    - Create test tree                                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Test Grouping & Worker Assignment                        │
│    - Group tests for parallel execution                     │
│    - Create worker processes                                │
│    - Assign test groups                                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Worker Execution (per worker)                           │
│    ├─ Setup worker-scope fixtures                          │
│    ├─ For each test group:                                 │
│    │   ├─ Setup test-scope fixtures                        │
│    │   ├─ Run beforeAll hooks                              │
│    │   ├─ For each test:                                   │
│    │   │   ├─ Run beforeEach hooks                         │
│    │   │   ├─ Execute test function                      │
│    │   │   ├─ Run afterEach hooks                         │
│    │   │   └─ Collect results                             │
│    │   ├─ Run afterAll hooks                              │
│    │   └─ Teardown test-scope fixtures                     │
│    └─ Teardown worker-scope fixtures                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Artifact Collection                                      │
│    - Collect traces                                         │
│    - Collect screenshots                                    │
│    - Collect videos                                         │
│    - Collect logs                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Report Generation                                        │
│    - Initialize reporters                                   │
│    - Report test results                                    │
│    - Generate report files                                  │
│    - Output summary                                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Global Teardown                                          │
│    - Run globalTeardown hooks                               │
│    - Teardown plugins                                       │
│    - Cleanup resources                                      │
└─────────────────────────────────────────────────────────────┘
```

### 7.10 Key Workflow Characteristics

**Parallel Execution**:

- Tests run in parallel across multiple workers
- Each worker has isolated browser instances
- Test groups are balanced for optimal parallelism
- Dependencies prevent conflicting parallel execution

**Isolation**:

- Each test gets fresh browser context
- Fixtures are scoped (test vs worker)
- No shared state between tests
- Independent test execution

**Resilience**:

- Auto-waiting prevents flakiness
- Retry mechanism handles transient failures
- Timeout management prevents hanging tests
- Error recovery ensures cleanup

**Observability**:

- Comprehensive tracing
- Detailed error reporting
- Step-by-step execution logs
- Visual debugging tools

---

## 8. Additional Technical Details

### 8.1 Browser Communication Protocol

Playwright uses browser-specific protocols for communication:

- **Chromium**: Chrome DevTools Protocol (CDP)
- **Firefox**: Firefox-specific protocol (similar to CDP)
- **WebKit**: WebKit Inspector Protocol

All protocols are abstracted through a unified API in `packages/playwright-core/src/server/`.

### 8.2 Test Isolation Mechanisms

1. **Browser Context Isolation**: Each test gets a new browser context (like incognito mode)
2. **Process Isolation**: Tests run in separate worker processes
3. **Fixture Scoping**: Fixtures are scoped to prevent cross-test contamination
4. **Storage Isolation**: Cookies, localStorage, sessionStorage are isolated per context

### 8.3 Performance Optimizations

1. **Context Reuse**: Option to reuse browser contexts between tests (when safe)
2. **Parallel Execution**: Tests run in parallel across workers
3. **Smart Waiting**: Auto-waiting reduces unnecessary delays
4. **Lazy Loading**: Test files loaded only when needed
5. **Caching**: Compilation cache for faster test loading

### 8.4 Error Recovery

- **Fixture Failures**: Dependent fixtures are marked as failed
- **Hook Failures**: Suite hooks failures skip remaining tests
- **Test Failures**: Test marked as failed, execution continues
- **Worker Crashes**: Worker is restarted, tests re-assigned
- **Browser Crashes**: Browser is restarted, test is retried

---

*End of Documentation*
