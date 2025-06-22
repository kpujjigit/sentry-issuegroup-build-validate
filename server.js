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

app.get('/config.js', (req, res) => {
  res.type('application/javascript').send(`window.SENTRY_ORG='${process.env.SENTRY_ORG}';\nwindow.SENTRY_PROJECT='${process.env.SENTRY_PROJECT}';\nwindow.SENTRY_DSN='${process.env.SENTRY_DSN}';`);
});

app.use(Sentry.expressErrorHandler());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
