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

const request = require('request');
const config = require('nconf');
const path = require('path');

config.argv()
  .env()
  .file(path.resolve(__dirname, '../config/config.json'));

module.exports = {
  getListOfGoogleAnalyticsIds: () => {

    let auth = Buffer.from(config.get('MIRRORGATE_USER') + ':' + config.get('MIRRORGATE_PASSWORD')).toString('base64');

    return new Promise((resolve, reject) => {
      request( {
        url: `${config.get('MIRRORGATE_ENDPOINT')}/api/user-metrics/analytic-views`,
        headers: {
          'content-type': 'application/json',
          'Authorization' : `Basic ${auth}`
        }
      }, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        if(res.statusCode >= 400) {
          return reject({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage
          });
        }
        resolve(JSON.parse(body));
      });
    });
  },

  saveMetrics: (metrics) => {

    let auth = Buffer.from(config.get('MIRRORGATE_USER') + ':' + config.get('MIRRORGATE_PASSWORD')).toString('base64');

    console.log('Saving ' + JSON.stringify(metrics));

    return new Promise((resolve, reject) => {
      request.post(`${config.get('MIRRORGATE_ENDPOINT')}/api/user-metrics`, {
        headers: {
          'content-type': 'application/json',
          'Authorization' : `Basic ${auth}`
        },
        body: JSON.stringify(metrics)
      },
      (err, res, body) => {
        if (err) {
          return reject(err);
        }
        if(res.statusCode >= 400) {
          return reject({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage
          });
        }
        resolve(JSON.parse(body));
      });
    });
  }
};
