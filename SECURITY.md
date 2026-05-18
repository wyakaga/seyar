# 🛡️ Security Policy (SECURITY.md)

At Seyar, we take the security, integrity, and privacy of your data extremely seriously. Because Seyar is a mindfulness application designed to help you manage your financial habits, we believe your personal earnings and purchase behaviors belong to **you and you alone**.

This document details our data security architecture, supported versions, and how to responsibly report any security vulnerabilities you discover.

---

## 🗺️ Table of Contents

1. [Data Security & Privacy Architecture](#-data-security--privacy-architecture)
2. [Supported Versions](#-supported-versions)
3. [Reporting a Vulnerability](#-reporting-a-vulnerability)
4. [Developer Security Best Practices](#-developer-security-best-practices)

---

## 🔒 Data Security & Privacy Architecture

Seyar is built on a **local-first, offline-first philosophy**. This design inherently protects you from traditional cloud database leaks, remote breaches, and third-party data tracking.

```
┌────────────────────────────────────────────────────────┐
│                      USER DEVICE                       │
│                                                        │
│   ┌─────────────────────┐    ┌─────────────────────┐   │
│   │    EXPO SQLITE      │    │  EXPO SECURE STORE  │   │
│   │      (app.db)       │    │ (Keychain/Keystore) │   │
│   │                     │    │                     │   │
│   │  Stores items, time │    │  Stores salary,     │   │
│   │  costs, statuses &  │    │  hourly rate &      │   │
│   │  reflection details │    │  onboarding state   │   │
│   └─────────────────────┘    └─────────────────────┘   │
│                                                        │
└────────────────────────────────────────────────────────┘
                    NO CLOUD TRANSMISSION
```

### 1. Zero Cloud Transmission (Off-Grid)

Seyar does **not** transmit, sync, or upload your financial figures, salary details, item logs, or review statuses to any remote cloud servers. There is no external database or telemetry tracking. Your data is restricted to the sandbox storage allocated to the Seyar app on your physical device.

### 2. SQLite Local Database

Your daily tracked items, prices, and time costs are stored in a local SQLite database (`app.db`) managed through Drizzle ORM. Access to this database is protected by platform-level sandbox isolation, preventing other applications from reading or writing to Seyar's data.

### 3. Hardware-Backed Secure Storage

Sensitive personal figures (such as your monthly take-home pay, working schedule, and calculated hourly rate) are persistently stored using [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/secure-store/). SecureStore leverages device hardware-backed encryption:

- **iOS:** Saved inside the secure **Keychain** utilizing `kSecClassGenericPassword` credentials.
- **Android:** Encrypted using AES inside **SharedPreferences**, with the key securely managed by the hardware-backed **Android KeyStore** system.

---

## 📈 Supported Versions

We actively maintain the security of our stable release versions. Please refer to the table below to see which versions are receiving security patches:

| Version      | Supported | Notes                                                     |
| :----------- | :-------: | :-------------------------------------------------------- |
| **v1.0.x**   |  ✅ Yes   | Current stable release branch.                            |
| **< v1.0.0** |   ❌ No   | Beta/experimental pre-releases. Please upgrade to v1.0.x. |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or susceptibility within Seyar, please **do not** open a public GitHub issue. Publicly disclosing a vulnerability could put users at risk. Instead, please follow the responsible disclosure process below:

### How to Report

1. Email your findings directly to our security contact at **soezette@duck.com**.
2. Please include:
   - A detailed description of the vulnerability.
   - Steps to reproduce the issue (proof-of-concept scripts or instructions).
   - The version number of Seyar and the operating system (iOS/Android) tested.

### Our Response Timeline

We appreciate the security community's help in keeping Seyar safe. Once a vulnerability report is received:

- **Acknowledgement:** We will acknowledge receipt of your report within **48 hours**.
- **Triage & Assessment:** We will assess the severity and impact within **3 business days**.
- **Remediation & Patching:** If validated, we aim to release a patched version on our stable release branch within **7 days**, depending on the complexity and severity of the vulnerability.
- **Public Recognition:** Once the vulnerability is patched, we will gladly credit you for your responsible disclosure in our release notes (unless you prefer to remain anonymous).

---

## 💻 Developer Security Best Practices

If you are contributing to Seyar, please adhere to these security development rules:

- **No Credentials in Commits:** Never hardcode api keys, secrets, or testing passwords in the codebase.
- **Dependency Auditing:** Regularly audit local dependencies to detect and fix vulnerable npm modules:
  ```bash
  npm audit
  ```
- **Safe Storage Use:** If you write new configuration modules that deal with salary, credentials, or personal identifiers, always persist them to `SecureStore` (defined in [lib/secureStore.ts](https://github.com/wyakaga/seyar/blob/master/lib/secureStore.ts)) rather than standard unencrypted SQLite columns.

---

Thank you for helping us keep **Seyar** safe, secure, and completely private! 🛡️
