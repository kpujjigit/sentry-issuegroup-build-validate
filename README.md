# sentry-issuegroup-build-validate

This is a small web application that helps you compose and validate [Sentry](https://sentry.io) issue grouping rules. It can run locally using a Node.js server or be deployed as a static site with a serverless function on Vercel.

## Features

- **Rule Builder** – interactively add matchers and expressions to compose fingerprint rules. The built rule can be copied directly into your Sentry project settings.
- **Rule Validator** – paste existing rules and instantly see whether they are valid, invalid or have potential improvements.
- **Sentry Integration** – the client initializes Sentry for error monitoring, performance tracking, profiling and session replay using settings exposed by a small configuration endpoint.

## Running Locally

1. Clone the repository and install dependencies:
   ```bash
   git clone <repo-url>
   cd sentry-issuegroup-build-validate
   npm install
   ```
2. Create a `.env` file based on `.env.example` and provide the Sentry credentials for your project.
3. Start the development server:
   ```bash
   node server.js
   ```
4. Open `http://localhost:3000` in your browser.

## Deploying to Vercel

1. [Install the Vercel CLI](https://vercel.com/docs/cli) and log in with `vercel login`.
2. Run `vercel` in the project directory and follow the prompts to create a new project.
3. In the Vercel dashboard or via `vercel env`, set the environment variables `SENTRY_ORG`, `SENTRY_PROJECT` and `SENTRY_DSN`.
4. Deploy the site with `vercel --prod`.

Vercel will automatically serve the static assets in the repository and run the `/api/config.js` function to expose your configuration to the client.

