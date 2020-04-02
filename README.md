# breakscheduler

[![Build Status](https://travis-ci.org/kevr/breakscheduler.svg?branch=help)](https://travis-ci.org/kevr/breakscheduler)

Source code for the [breakscheduler.com](https://breakscheduler.com "Break Scheduler") webpage.

## Design

This project implements the UI portion of the Break Scheduler website. Written in `React.js`, the UI is meant to authenticate and speak with our API, which can be configured via apiPrefix in `src/config.json`.

## Deployment

To deploy under production, we have a various number of dependencies.

* NVM

#### Setup a webhost user

To host this project in production under nginx, we require a user with read and write access to it's own home directory, as well as an nginx install destination. Login to your server as root, and add a user called (for the purposes of this README: `www`).

    # useradd -s /bin/bash -m www

#### Give webhost user sudo capability for setup

**NOTE**: This should be reversed after initial project deployment is complete.

    # gpasswd -a www sudo

#### Configure NVM as `www`

    $ nvm install 10
    $ nvm use 10

#### Install Required NVM Packages

    $ npm install

#### Build Production Release

After running the following command, the `./build` directory shall contain the entire website compiled into production.

    $ npm run build
