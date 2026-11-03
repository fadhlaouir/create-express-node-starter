# Security Policy

## Supported Versions

Security fixes go into the latest release only. Projects you already generated are yours: fixes to the templates reach new projects, so apply them to existing ones by hand when an advisory tells you to.

| Version | Supported |
| ------- | --------- |
| 2.x     | ✅        |
| < 2.0   | ❌        |

## What to Report

- **The CLI** (`lib/cli.js`): anything that runs unexpected commands, writes outside the project directory you chose, or installs something you didn't ask for.
- **The templates** (`lib/project-files/`): vulnerabilities in the code a generated project starts with, such as authentication, authorization, file uploads, input handling or a missing `.gitignore` that would expose `.env`.
- **The dependencies** a generated project installs, when a known vulnerability affects it.

## Reporting a Vulnerability

Please report it privately, never in a public issue:

- **Preferred:** [open a private security advisory](https://github.com/fadhlaouir/create-express-node-starter/security/advisories/new) on GitHub.
- **Or by email:** [raed.fadhlaoui@hotmail.com](mailto:raed.fadhlaoui@hotmail.com).

Include:

- the version you used (`npm view create-express-node-starter version`, or the one in your `package.json`) and the template you chose;
- the steps to reproduce;
- what an attacker could do with it.

## Response Timeline

- We acknowledge your report within 48 hours.
- We confirm the issue and share a plan within 7 days.
- Once fixed, we publish a release and a GitHub security advisory, and credit you unless you prefer not to be named.
