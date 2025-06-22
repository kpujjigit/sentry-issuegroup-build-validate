# sentry-issuegroup-build-validate

This repository contains a small static web application that helps you create and verify [Sentry](https://sentry.io) issue grouping rules. It provides two main tools:

1. **Rule Builder** – interactively add matchers and expressions to compose a fingerprint rule. The builder outputs a valid rule string that you can copy into your Sentry project settings.
2. **Rule Validator** – paste one or many fingerprint rules and the validator will highlight each line in green (valid), red (invalid) or yellow (potential improvements). Hover over a rule to see a short explanation or suggestion.

The application is served via a small Node.js server that loads Sentry configuration
from a `.env` file. The server also exposes a `config.js` endpoint consumed by the
client to initialize Sentry.

## Running Locally

1. Clone the repository and change into the directory:
   ```bash
   git clone <repo-url>
   cd sentry-issuegroup-build-validate
   ```
2. Copy `.env.example` to `.env` and fill in your Sentry details.
3. Install dependencies and start the Node.js server:
   ```bash
   npm install
   node server.js
   ```
4. Open `http://localhost:3000` in your browser.

