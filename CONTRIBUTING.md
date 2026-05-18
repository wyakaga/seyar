# 🧭 Contributing to Seyar

First off, thank you for taking the time to contribute to Seyar! Contributions from the community help make Seyar a more robust, elegant, and mindful financial companion.

By contributing to this project, you agree to abide by our code quality standards, branching workflows, and collaboration guidelines.

---

## 🗺️ Table of Contents

1. [Branching Strategy](#-branching-strategy)
2. [Prerequisites & Development Setup](#-prerequisites--development-setup)
3. [Local Development Workflow](#-local-development-workflow)
4. [Database & Schema Development](#-database--schema-development)
5. [Code Quality & Standards](#-code-quality--standards)
6. [Git & Pull Request Guidelines](#-git--pull-request-guidelines)

---

## 🌿 Branching Strategy

Seyar uses a branching model with two main, long-running branches:

- **`develop`:** The primary branch for ongoing active integration. All new features and bug fixes should branch off `develop` and target `develop` for pull requests.
- **`master`:** The production-ready release branch. It contains only stable, thoroughly tested code ready for production release. The `develop` branch is merged into `master` when preparing a new release.

```
───[ master ] (Production Releases) ──────────────────────────────────►
       ▲
       │ (Merge release)
───[ develop ] (Active Integration / Latest Code) ────────────────────►
       ▲                                     ▲
       │ (Branch off / Merge PR)             │ (Branch off / Merge PR)
  feature/my-cool-feature               bugfix/fix-some-bug
```

- **Feature Branches:** `feature/your-feature-name` (branched off `develop`)
- **Bugfix Branches:** `bugfix/issue-description` (branched off `develop`)
- **Hotfix Branches:** `hotfix/critical-fix` (branched off `master` for urgent production fixes)

---

## 🛠️ Prerequisites & Development Setup

Make sure you have the following software installed locally:

- **Node.js:** (LTS version is recommended)
- **Mobile Simulator / Device:**
  - **iOS:** Xcode Simulator (macOS only)
  - **Android:** Android Studio Emulator
  - **Physical Device:** The [Expo Go](https://expo.dev/go) app installed on your iOS/Android phone.

### Setting Up the Repository

1. Clone the repository:
   ```bash
   git clone https://github.com/wyakaga/seyar.git
   cd seyar
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize Husky git hooks:
   ```bash
   npm run prepare
   ```

---

## 🚀 Local Development Workflow

Start the Expo Metro bundler:

```bash
npx expo start
```

### Running on Simulators or Physical Devices

Once Metro is running, use these keyboard shortcuts to launch your target environment:

- Press **`a`** to open the app on an active Android emulator or connected device.
- Press **`i`** to open the app on an iOS simulator.
- Scan the console QR code with your mobile camera (iOS) or the Expo Go app (Android) to test on a physical device.

---

## 🗃️ Database & Schema Development

Seyar uses **Drizzle ORM** paired with **Expo SQLite** to manage its local database.

### 1. Modifying the Schema

If you need to introduce new tables or alter fields:

- Make edits inside [db/schema.ts](https://github.com/wyakaga/seyar/blob/master/db/schema.ts).
- Never edit migrations or database entities directly on the device database file.

### 2. Generating Schema Migrations

Once schema edits are finished, you must generate a database migration script:

```bash
npx drizzle-kit generate
```

This generates a new SQL/JS migration module inside the `src/drizzle` folder. These migrations are automatically applied on the next app startup inside [app/\_layout.tsx](https://github.com/wyakaga/seyar/blob/master/app/_layout.tsx) via the `useMigrations()` hook.

### 🔍 Auditing Data with Drizzle Studio

While developing, you can visually audit, query, and edit the SQLite database on your device or simulator using Drizzle Studio:

1. Ensure the app is running: `npx expo start`
2. Open the visual Drizzle Studio inspector built directly into Expo Dev Tools to manage the `app.db` databases.

---

## 🧼 Code Quality & Standards

We enforce strict styling, formatting, and static analysis configurations to keep the codebase clean, uniform, and maintainable.

### Styling & Tailwind

- Seyar uses **Tailwind CSS v4** + **Uniwind** + **HeroUI Native (Beta)** for styling.
- Use Tailwind utility classes or custom HeroUI component tokens rather than inline styles where possible.

### Linting & Formatting Commands

Before pushing code, run the verification scripts locally:

- **Linting Checks:** Check for unused imports and compilation/style bugs:
  ```bash
  npm run lint
  ```
- **Prettier Formatting:** Automatically format files according to Prettier specs:
  ```bash
  npm run format
  ```
- **Format Audit:** Verify that all code conforms to the required styling guides:
  ```bash
  npm run format:check
  ```

### 🐶 Automatic Git Hooks (Husky)

We use `husky` and `lint-staged` to automatically audit your edits on commit. When you run `git commit`, the hook will:

1. Inspect only changed TypeScript and configuration files.
2. Run ESLint checks and format them automatically with Prettier.
3. Block the commit if lint errors are found, ensuring bad code never reaches the repository!

---

## 🤝 Git & Pull Request Guidelines

To keep the project history readable, please adhere to these Git practices:

### Commit Messages

We encourage the use of clear, structured commit messages:

- `feat: add onboarding currency selector`
- `fix: resolve countdown timer spring calculation overlap`
- `docs: update setup steps in contributing guide`
- `chore: update packages and prettier settings`

### Submitting a Pull Request

1. Keep your branch updated with `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-feature
   git merge develop
   ```
2. Run `npm run lint` and `npm run format:check` locally to confirm everything is clean.
3. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature
   ```
4. Open a Pull Request on GitHub targeting the **`develop`** branch.
5. Provide a descriptive PR explanation detailing what was changed, what features were added, and manual verification steps (with screenshots/GIFs for visual layout changes!).

---

Thank you for contributing to **Seyar**! Your support keeps our financial mindfulness simple, beautiful, and accessible. 🧭
