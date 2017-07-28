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

const MIRRORGATE_ENDPOINT =
    process.env.MIRRORGATE_ENDPOINT || 'http://localhost:8080/mirrorgate';

module.exports = {
  getListOfGoogleAnaliticsIds: () => {
    return new Promise((resolve, reject) => {
      request.get(
          MIRRORGATE_ENDPOINT + '/api/user-metrics/analytic-views',
          (err, res, body) => {
            if (err) {
              return reject(err);
            }
            resolve(JSON.parse(body));
          });
    });
  },

  saveMetrics: (metrics) => {
    console.log('Saving ' + JSON.stringify(metrics));

    return new Promise((resolve, reject) => {
      request.post(
          MIRRORGATE_ENDPOINT + '/api/user-metrics', {
            headers: {
              'content-type': 'application/json',
            },

            body: JSON.stringify(metrics)
          },
          (err, res, body) => {
            if (err) {
              return reject(err);
            }
            resolve(JSON.parse(body));
          });
    });
  }
};
