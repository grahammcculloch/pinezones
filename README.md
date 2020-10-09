# Pinezones - a PineJS Demo Web App

A simple web app that uses PineJS on the backend and React on the front-end.

The app shows preferred working hours for your globally-distributed team, letting you easily find mutually convenient times to meet, etc.

## Pre-requisites

You'll need to create a postgres database for use with this app. For example:
```shell
$ createuser -W pinejsUser
$ createdb pinezones -O pinejsUser
```

## Running Pinezones locally

* Clone this repo:
  ```shell
  $ git clone git@github.com:grahammcculloch/pinezones.git
  ```

* Install dependencies:
  ```shell
  $ cd pinezones && npm install
  ```

* Rename `env.local` to `.env.local` and replace `<YOUR-LOCAL-POSTGRES-DB-STRING>` with the DATABASE_URL of your local postgres database (includes the user and password). If you used the exact user, password and database name from the [pre-requisites section](#pre-requisites) and a password of `pinejsPassword`, your DATABASE_URL should look like this:
```
postgres://pinejsUser:pinejsPassword@localhost:5432/pinezones
```

* Start the server:
  ```shell
  $ npm run start-server
  ```

* Start the front-end app:
  ```shell
  $ npm run start-app
  ```

* The app will be running at `https://localhost:3000` in your browser.

## Loading Data

_Ask Graham directly for an import script and exported Balena team data!_