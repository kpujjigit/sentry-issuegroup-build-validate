# sentry-issuegroup-build-validate

This repository contains a small static web application that helps you create and verify [Sentry](https://sentry.io) issue grouping rules. It provides two main tools:

1. **Rule Builder** – interactively add matchers and expressions to compose a fingerprint rule. The builder outputs a valid rule string that you can copy into your Sentry project settings.
2. **Rule Validator** – paste one or many fingerprint rules and the validator will highlight each line in green (valid), red (invalid) or yellow (potential improvements). Hover over a rule to see a short explanation or suggestion.

The implementation is completely client‑side and requires no build step. Open `index.html` in a browser to use it.
