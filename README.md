![Continuous Integration](https://github.com/Zwirner/design-system/actions/workflows/ci.yml/badge.svg)

Duplicate the `.env.local.example` file and rename it as `.env`. Ask engineering for the following variables:
- `SANITY_STUDIO_PROJECT_ID` 
- `SANITY_STUDIO_TEST_DATABASE`
- `SANITY_STUDIO_VERCEL_ENV`
- `SANITY_STUDIO_VERCEL_URL`
- `SANITY_STUDIO_SANITY_API_VERSION`
  
# Updating your the dev database with latest changes done in prod

Login to sanity cli running the following command in a terminal.

```bash
yarn sanity login
```

Choose _Google_ as the login type, open the URL that the terminal will show you, and sign in with your David Zwirner google account. If everything went well you should see a message like this:

```bash
Login successful
```

# Sync the dev database with prod

Run this script to sync the dev database with prod

```bash
yarn sync-dev-db
```

# Continuous Integration

- Every new PR to the `main` branch triggers the `CI` workflow that builds and 
  lints the project. Also, every push to the `main` triggers the `CI` workflow.

# Automatic dependency bumps

The Dependabot configuration is located in the `.github/dependabot.yml`. It is 
configured to check weekly for new versions of dependencies in the `package.json`
and actions used in the workflows. If there is a new version, Dependabot opens a PR.

## Secrets

- `DZDEPENDABOT_GH_TOKEN` - personal access token of the `dzdependabot` account
with the `packages:read` permission. It is required to check for new versions of
packages published in our private repositories, e.g. `design-system`.
