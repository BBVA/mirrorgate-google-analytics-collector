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
const config = require('nconf');
const path = require('path');

config.argv()
  .env()
  .file(path.resolve(__dirname, './config/config.json'));

let AWS = require('aws-sdk');
let s3 = new AWS.S3();

function perform(callback) {
  main().then((log) => {
    callback(null, log);
  }).catch(callback);
}

exports.handler = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  if(config.get('S3_BUCKET_NAME') && config.get('S3_BUCKET_PEM_KEY')) {
    s3.getObject({
      Bucket: config.get('S3_BUCKET_NAME'),
      Key: config.get('S3_BUCKET_PEM_KEY')
    }).promise()
      .then((data) => {
        config.set('GA_PEM_KEY', data.Body.toString());
        if(config.get('S3_BUCKET_KEY')) {
          s3.getObject({
            Bucket: config.get('S3_BUCKET_NAME'),
            Key: config.get('S3_BUCKET_KEY')
          }).promise()
            .then((data) => {
              data = JSON.parse(data.Body);
              config.set('MIRRORGATE_USER', data.MIRRORGATE_USER);
              config.set('MIRRORGATE_PASSWORD', data.MIRRORGATE_PASSWORD);
              perform(callback);
            })
            .catch( err => console.error(`Error: ${JSON.stringify(err)}`));
          } else {
            perform(callback);
          }
      })
      .catch(callback);
  } else if(config.get('S3_BUCKET_NAME') && config.get('S3_BUCKET_KEY')) {
    s3.getObject({
      Bucket: config.get('S3_BUCKET_NAME'),
      Key: config.get('S3_BUCKET_KEY')
    }).promise()
      .then((data) => {
        data = JSON.parse(data.Body);
        config.set('MIRRORGATE_USER', data.MIRRORGATE_USER);
        config.set('MIRRORGATE_PASSWORD', data.MIRRORGATE_PASSWORD);
        perform(callback);
      })
      .catch( err => console.error(`Error: ${JSON.stringify(err)}`));
  } else {
    perform(callback);
  }

};
