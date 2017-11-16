# MirrorGate plugin for Google Analytics

![MirrorGate](./media/images/logo-ae.png)


This Node application connects to Google Analytics and collects analytics information for MirrorGate.

# Configuring

You need to set the following environment variables:

```sh
# Mirrorgate endpoint url
export MIRRORGATE_ENDPOINT=http://localhost:8080/mirrorgate

# Google Analytics service account pem key file url
export GA_PEM_FILE=./my.pem

# Google Analytics service account pem key password
export GA_PEM_KEY=asduqierufasdfjuaoisfña

```

# Usage

First install dependencies

```sh
  cd collector
  npm i
```

Then run `local.js` with npm

```sh
  nmp run index
```

## Running in Amazon Lambda

First package script zip with the following gulp task

```sh
npm i
./node_modules/gulp/bin/gulp.js package
```
or with npm

```sh
npm run package
```

Create a lambda with runtime Node.js 6.10 or grater and folowing handler `lambda.handler`. Note it will execute only once, so you will have to use a timed trigger to execute it eventually.

You can provide the environment variable `S3_BUCKET_NAME` to identify and S3 bucket to download the pem key from, and `S3_BUCKET_KEY` for the name of the pem file.
