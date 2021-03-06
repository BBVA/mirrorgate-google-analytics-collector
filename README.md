# MirrorGate plugin for Google Analytics

![MirrorGate](./media/images/logo-ae.png)

This Node application connects to Google Analytics and collects analytics information for MirrorGate.

## Configuring

You need to set the following environment variables:

```sh
# MirrorGate endpoint url
export MIRRORGATE_ENDPOINT=http://localhost:8080/mirrorgate

# Google Analytics service account pem key file url
export GA_PEM_FILE=./my.pem

# Google Analytics service account pem key password
export GA_PEM_KEY=xxxxxxxxxx

```

Note that GA accounts have to grant `Read & Analyze` permission to MirrorGate account in order to retrieve metrics data.

## Usage

First install dependencies

```sh
  npm i
```

Then run `local.js` with npm

```sh
  nmp start
```

## Running in Amazon Lambda

First package script zip with the following npm command

```sh
  npm run package
```

Create a lambda with runtime Node.js 6.10 or grater and following handler `lambda.handler`. Note it will execute only once, so you will have to use a timed trigger to execute it eventually.

You can provide the environment variable `S3_BUCKET_NAME` to identify and S3 bucket to download the pem key from, and `S3_BUCKET_KEY` for the name of the pem file.
