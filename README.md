<p align="center">
  <img src="./assets/images/icon.png" width="120" height="120" alt="Seyar Icon" />
</p>

# 🧭 Seyar

Seyar is a mindful financial tracking and budgeting application built on universal React Native and Expo. It aims to cure impulsive consumerism by converting monetary prices into the ultimate, non-renewable resource: **the hours of your life spent working**.

Instead of viewing a purchase as a simple cash transaction, Seyar translates it into **labor-hours**. By inserting a friction-focused "Anchor" period (cool-down timer) and enforcing retrospective check-ins, the app re-trains your brain to understand the true temporal cost of desires, helping you reclaim your life and build a healthier relationship with money.

---

## 🗺️ Table of Contents

1. [Core Philosophical Concepts](#-core-philosophical-concepts)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [File Structure](#-file-structure)
5. [Database Architecture](#-database-architecture)
6. [Getting Started](#-getting-started)
7. [Database Migrations & Tooling](#-database-migrations--tooling)
8. [Formatting & Linting](#-formatting--linting)

---

## 💡 Core Philosophical Concepts

```
┌────────────────────────────────────────────────────────┐
│              MONETARY VALUE (Price)                    │
│                        │                               │
│     divided by your true HOURLY WORTH                  │
│                        ▼                               │
│              TEMPORAL COST (Life Hours)                │
└────────────────────────────────────────────────────────┘
```

- **Hourly Worth (Temporal Rate):** Most people calculate their hourly rate by dividing salary by contracted hours. Seyar calculates your true hourly worth by looking at your actual monthly salary against your real work days and hours, showing exactly how much of your "life force" is exchanged per hour.
- **The Anchor (Impulse Friction):** Delaying gratification is the most powerful tool against impulse buying. Seyar allows you to "Anchor" (put on hold) items you want to buy for **24 hours, 3 days, or 1 week**. The item is physically locked, prompting introspection during the cool-down timer.
- **Life Reclaimed:** Hours of labor that you _saved_ from being spent by choosing to skip or reject an anchored purchase.
- **Ghost Hours & Regret Rate:** Purchases don't always bring joy. When you look back at purchases after 30 days and mark them as regretted, that labor-time is logged as **Ghost Hours**—time you worked for things you ended up hating. The **Regret Rate** is the percentage of your overall spending that was wasted in vain.

---

## ✨ Key Features

- **🚀 Mindful Onboarding Wizard:** A beautiful, multi-step flow that welcomes users, collects monthly income, work days, and work hours, and computes their exact **Hourly Temporal Rate**.
- **🎯 Remaining Life Tracker:** A sleek dashboard on the Home screen showing how many "working hours" of income you have remaining this month after deducting purchases and current anchors.
- **⚓ The Anchor Hold (Friction System):**
  - **Hold:** Locks an item behind a spring-animated countdown timer (24h / 3d / 1w).
  - **Skip:** Instantly reclaims the time cost, increasing your **Life Reclaimed** metrics.
  - **Spent:** Immediately records the purchase.
- **🕒 Delayed Reflection (30-Day Check-in):** Built-in delayed review hook. After 30 days, the app automatically triggers a check-in sheet prompting you: _Did you Love or Regret this purchase?_
- **📊 The Bearing Board (Analytics):**
  - **Reclaimed Hours:** Total hours of labor saved.
  - **Ghost Hours Tracker:** Displays wasted working hours with visual insights (e.g. _"You worked a full week for things you hate"_).
  - **Regret Rate:** The raw percentage of labor spent in vain.
  - **Mindful Decision History:** A chronological history log showcasing all your rejected and regretted purchases.

---

## 🛠️ Technology Stack

Seyar is built using a modern, performant, and premium React Native architecture:

| Category              | Technology                                                                                  | Purpose                                                               |
| :-------------------- | :------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------- |
| **Core Framework**    | [Expo SDK 54](https://expo.dev/)                                                            | Cross-platform runtime & universal app environment                    |
| **Navigation**        | [Expo Router v6](https://docs.expo.dev/router/introduction/)                                | Typed, file-based routing system                                      |
| **Runtime**           | [React Native 0.81.5](https://reactnative.dev/) & [React 19.1.0](https://react.dev/)        | Native UI rendering and state foundation                              |
| **Styling**           | [Tailwind CSS v4](https://tailwindcss.com/) & [Uniwind](https://github.com/uniwind/uniwind) | Modern, fast design tokens and utility-first styling                  |
| **Component Library** | [HeroUI Native (Beta)](https://v3.heroui.com/)                                              | Beautiful, high-end, premium dark-themed custom UI components         |
| **Animations**        | [React Native Reanimated v4](https://docs.swmansion.com/react-native-reanimated/)           | High-performance spring physics, transitions, and indicators          |
| **Database**          | [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)                            | Local, high-performance SQLite storage                                |
| **ORM**               | [Drizzle ORM](https://orm.drizzle.team/)                                                    | Type-safe queries and database schema migrations                      |
| **State Management**  | [Zustand](https://github.com/pmndrs/zustand)                                                | Super light, reactive global state                                    |
| **Secure Storage**    | [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/secure-store/)                | Encrypted key-value persistence for salary & onboarding configuration |
| **Validation**        | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)                   | Type-safe form controllers and schema-based verification              |

---

## 📁 File Structure

The project represents a clean, modular file-based routing architecture:

```filepath
seyar/
├── app/                      # Expo Router navigation routes
│   ├── (tabs)/               # Bottom tab screens
│   │   ├── _layout.tsx       # Bottom navigation layout configuration
│   │   ├── index.tsx         # Dashboard / Home tab
│   │   ├── anchor.tsx        # Anchored (On-Hold) items tab
│   │   └── bearing.tsx       # Bearing (Analytics & History) tab
│   ├── onboarding/
│   │   └── index.tsx         # Multi-step Onboarding setup
│   ├── _layout.tsx           # Application root layout & database initializer
│   └── setting.tsx           # Settings screen (Temporal value editor)
├── assets/                   # Fonts, icons, and static images
├── components/               # Reusable UI component architecture
│   ├── anchored/             # AnchoredCard, DecisionBottomSheet
│   ├── bearing/              # BearingCard
│   ├── home/                 # HomeBottomSheet, CheckInBottomSheet
│   ├── icons/                # High-quality SVG vector icon components
│   ├── onboarding/           # Onboarding step views (Salary, WorkHour, TimeWorth)
│   ├── ErrorFallback.tsx     # Graceful error handling UI
│   └── Text.tsx              # Universal styled typography component
├── db/                       # Local SQLite database subsystem
│   ├── client.ts             # Drizzle instance initialization
│   └── schema.ts             # SQLite table schema definitions
├── hooks/                    # Reusable custom React hooks
│   ├── useAnchorProgress.ts  # Calculations for hold countdown timers
│   ├── useAuthStore.ts       # Authentication / Onboarding global state
│   ├── useErrorService.ts    # Globalized error handling & success toasts
│   ├── useItemManagement.ts  # Database CRUD interface for eyed items
│   ├── usePendingReviews.ts  # Delayed purchase check-in scheduler
│   └── useRemainingLife.ts   # Core monthly budget-hours calculator
├── lib/                      # Helper modules and constants
│   ├── currency.ts           # Currency formatting utilities
│   ├── formatPrice.ts        # Input price formatting helper
│   ├── secureStore.ts        # Expo SecureStore read/write wrappers
│   └── theme.ts              # Custom HeroUI Theme configurations
├── src/
│   └── drizzle/              # Auto-generated Drizzle Kit migration scripts
├── drizzle.config.ts         # Drizzle configuration config file
├── package.json              # App dependency configuration
└── tsconfig.json             # TypeScript rules configuration
```

---

## 🗄️ Database Architecture

The SQLite database uses [Drizzle ORM](https://orm.drizzle.team/) for schema definition and migrations.

### Table: `items`

Defined in [db/schema.ts](https://github.com/wyakaga/seyar/blob/master/db/schema.ts):

- **`id`** (`text`): Primary key, automatically generated using time-sorted `UUID v7`.
- **`name`** (`text`): Name of the item.
- **`price`** (`real`): Price of the item in the selected currency.
- **`timeCost`** (`real`): Translated price in labor hours (`Price / Hourly Worth`).
- **`status`** (`text`): Current lifecycle state of the item (`anchored`, `purchased`, `rejected`).
- **`reviewStatus`** (`text`): Delayed reflection status (`pending`, `loved`, `regretted`). Defaults to `pending`.
- **`unlockedAt`** (`integer`): Timestamp when the lock timer expires and the item is reviewable/decidable.
- **`purchasedAt`** (`integer`): Timestamp when the item was bought.
- **`createdAt`** (`integer`): Creation timestamp, automatically defaults to `new Date()`.

---

## 🚀 Getting Started

Follow these steps to set up the development environment and run the Seyar application on your local machine:

### 1. Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/go) app on your mobile device, or Xcode (macOS) / Android Studio (Windows/macOS) for simulators.

### 2. Install Dependencies

Clone the repository and run:

```bash
npm install
```

### 3. Initialize & Run

Start the Metro bundler:

```bash
npx expo start
```

- Press **`a`** to run on an Android emulator or connected device.
- Press **`i`** to run on an iOS simulator.
- Scan the QR code using your Expo Go app to test directly on your mobile device.

---

## 🗃️ Database Migrations & Tooling

Drizzle migrations are automatically applied on startup within [app/\_layout.tsx](https://github.com/wyakaga/seyar/blob/master/app/_layout.tsx) using the `useMigrations()` hook. Developers do not need to manually push migrations to local database instances.

### Generating Migrations

If you make changes to the schema file [db/schema.ts](https://github.com/wyakaga/seyar/blob/master/db/schema.ts), generate a new migration file:

```bash
npx drizzle-kit generate
```

This output script is created in `src/drizzle` and will be loaded and run automatically the next time the app launches.

### 🔍 Drizzle Studio (Database Viewer)

Seyar is equipped with `expo-drizzle-studio-plugin`. While running the development server, you can view, edit, and audit database tables directly inside your browser!

1. Start the app in development mode: `npx expo start`
2. Expo Dev Tools will host the Drizzle Studio visual client automatically.

---

## 🧼 Formatting & Linting

We enforce clean, standardized code practices via Husky, Prettier, and ESLint.

- **Lint Code:**
  ```bash
  npm run lint
  ```
- **Format Files:**
  ```bash
  npm run format
  ```
- **Format Check:**
  ```bash
  npm run format:check
  ```

---

_Seyar: Reclaim your life, one decision at a time._ 🧭
