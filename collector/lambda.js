/**
 *    Copyright 2017 Banco Bilbao Vizcaya Argentaria, S.A.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

/* Run as Lambda function */

const main = require('./lib/process');

let AWS = require('aws-sdk');
let s3 = new AWS.S3();

const BUCKET = 'mirrorgate-secrets' || process.env.S3_BUCKET_NAME;
const BUCKET_KEY = 'google-analytics.pem' || process.env.S3_BUCKET_KEY;

let key;

function perform() {
        main({pemKey:key}).then((log) => {
            callback(null, log);
          }).catch(callback);
}

exports.handler = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  if(!key) {
    s3.getObject({Bucket: BUCKET, Key: BUCKET_KEY})
      .promise()
      .then((data) => {
        key = data.Body.toString();
        perform();
      });
  } else {
    perform();
  }

};
