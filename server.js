const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

dotenv.config();
const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
    Sentry.httpIntegration(),
    Sentry.expressIntegration({ app }),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

app.use(express.static(path.join(__dirname, '.')));

const configHandler = require('./api/config');
app.get('/api/config.js', configHandler);

app.use(Sentry.expressErrorHandler());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
