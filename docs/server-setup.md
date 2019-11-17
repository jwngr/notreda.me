# Server Setup | notreda.me

## Table of Contents

- [Overview](#overview)
- [Initial Setup](#initial-setup)

## Overview

The only current server-side component of notreda.me is a cron job which scrapes the web to
automatically update the Notre Dame schedule when it changes.

Currently, notreda.me does not have its own server and instead piggy-backs off of the existing web
server for Six Degrees of Wikipedia.

## Initial Setup

1.  Piggy-back off of the existing web server for Six Degrees of Wikipedia.

1.  [Install, initialize, and authenticate to the `gcloud` CLI](https://cloud.google.com/sdk/docs/#install_the_latest_cloud_tools_version_cloudsdk_current_version).

1.  Set the default region and zone for the `gcloud` CLI:

    ```
    $ gcloud config set compute/region us-central1
    $ gcloud config set compute/zone us-central1-c
    ```

1.  SSH into the machine:

    ```bash
    $ gcloud compute ssh sdow-web-server-# --project=sdow-prod
    ```

1.  Install required operating system dependencies:

    ```bash
    $ sudo apt-get -q update
    $ sudo apt-get -yq nodejs
    ```

1.  Clone this directory via HTTPS as `jwngr-ops` and navigate into the repo:

    ```bash
    $ git clone https://jwngr-ops@github.com/jwngr/notreda.me.git
    $ cd notreda.me/
    ```

1.  Store the saved password so it does not need to be re-entered every git push:

    ```bash
    $ git config credential.helper store
    ```

1.  Attempt an empty `git push` to store the password.

    ```bash
    $ git push  # Enter password for jwngr-ops
    ```

1.  Install the required npm dependencies:

    ```bash
    $ cd scripts/
    $ npm install
    ```

1.  Run `crontab -e` and add the following cron jobs to that file:

    ```
    # Run the ND schedule update script every 15 minutes.
    */15 * * * * cd /home/jwngr/notreda.me/scripts/ndSchedules && NODE_ENV="production" ./update.sh

    # Run the future ND schedules audit script every day at 6 AM.
    0 6 * * * cd /home/jwngr/notreda.me/scripts/ndSchedules && NODE_ENV="production" node auditFutureSchedules.js
    ```

1.  Install a mail service in order to read logs from cron jobs:

    ```bash
    $ sudo apt-get -yq install postfix
    # Choose "Local only" and use the default email address.
    ```

    **Note:** Cron job logs will be written to `/var/mail/jwngr`.
