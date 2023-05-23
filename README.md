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