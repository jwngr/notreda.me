# Contributing | notreda.me

Thank you for contributing to notreda.me.

## Local setup

There are two main pieces you'll need to get set up running locally:

1.  Data processing scripts
2.  React + TypeScript frontend website built using Vite

There is some initial setup you'll need to run once, and some recurring setup each time you want to
run the site locally.

Note: The following instructions have only been tested on macOS.

### Initial setup

The first step is to clone the repo and move into the created directory:

```bash
$ git clone git@github.com:jwngr/notreda.me.git
$ cd notreda.me/
```

Create your local env file:

```bash
# Run from root of repo.
$ cp .env.example .env
```

Install project dependencies:

```bash
# Frontend deps
$ cd website/
$ npm install

# Scripts deps
$ cd ../scripts/
$ npm install
```

### Recurring setup

Every time you want to run the site locally, start the frontend dev server. You can run scripts in
a separate terminal tab as needed.

To run the frontend, open a new tab and run the following commands from the repo root:

```bash
$ cd website/
$ npm run start
```

The site can be found at http://localhost:3000.

If you need to run scripts, open a new tab and run commands from the `scripts/` directory:

```bash
$ cd scripts/
$ npm run build
```

## Repo organization

Here are some highlights of the directory structure and notable source files:

- `.github/` - Contribution instructions and CI config
- `data/` - Source data used by scripts
- `docs/` - Documentation
- `scripts/` - Data scraping and transformation utilities
  - `ndSchedules/update.ts` - Fetches latest schedule data
  - `ndSchedules/validate.ts` - Validates data integrity
  - `ndSchedules/transform.ts` - Processes and formats data
- `website/` - React + TypeScript frontend, built using Vite
- `firebase.json` - Firebase Hosting config
