module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.end(
    `window.SENTRY_ORG='${process.env.SENTRY_ORG}';\n` +
    `window.SENTRY_PROJECT='${process.env.SENTRY_PROJECT}';\n` +
    `window.SENTRY_DSN='${process.env.SENTRY_DSN}';`
  );
};
