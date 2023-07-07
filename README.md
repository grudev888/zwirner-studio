![Continuous Integration](https://github.com/Zwirner/design-system/actions/workflows/ci.yml/badge.svg)

# Environment setup

Duplicate the `.env.local.example` file and rename it as `.env`. Ask engineering for the following variables:
- `SANITY_STUDIO_PROJECT_ID` 
- `SANITY_STUDIO_TEST_DATABASE`
- `SANITY_STUDIO_VERCEL_ENV`
- `SANITY_STUDIO_VERCEL_URL`
- `SANITY_STUDIO_SANITY_API_VERSION`

# Feature-scoped datasets

When working on new features, it can be helpful to create a new dataset with
the data from the `production`. There is the `Create feature-scoped dataset` 
workflow to do exactly that. The name of the created dataset corresponds to the 
branch name it is launched from. Each time the workflow is launched it deletes 
the existing dataset and creates a new one, so it can be launched an indefinite 
number of times. The dataset related to the branch can be deleted manually by 
triggering the `Delete feature-scoped dataset` workflow.

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
