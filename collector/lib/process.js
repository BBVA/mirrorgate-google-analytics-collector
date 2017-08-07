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

const SERVICE_ACCOUNT_EMAIL = process.env.GA_SERVICE_ACCOUNT;

let googleapis = require('googleapis'), JWT = googleapis.auth.JWT,
    analytics = googleapis.analytics('v3');

let mg = require('./mirrorgate-client');

module.exports = function(config) {

  let authClient = new JWT(
      SERVICE_ACCOUNT_EMAIL, config.pemFile, config.pemKey,
      ['https://www.googleapis.com/auth/analytics.readonly']);

  let metrics = [];

  return new Promise((resolve, reject) => {

    authClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }

      mg.getListOfGoogleAnaliticsIds().then((ids) => {
        let pending = ids.length;
        ids.forEach((id) => {
          analytics.data.realtime.get(
              {
                auth: authClient,
                'ids': id,
                'metrics': 'rt:activeUsers'
              },
              function(err, result) {
                pending--;
                
                var rtActiveUsers;
                
                if (err) {
                  console.log(err);
                } else {
                  rtActiveUsers = parseInt(result.totalsForAllResults['rt:activeUsers'])
                }
                analytics.data.ga.get(
                  {
                    auth: authClient,
                    'ids': id,
                    'start-date': 'today',
                    'end-date': 'today',
                    'metrics': 'ga:7dayUsers',
                    'dimensions': 'ga:date'
                  },
                  function(err, result) {

                    if (err) {
                      console.log(err);
                    } else {
                      metrics.push({
                        viewId: id,
                        rtActiveUsers: rtActiveUsers,
                        ga7dayUsers: parseInt(result.totalsForAllResults['ga:7dayUsers'])
                      });
                    }
                    if(pending <= 0) {
                      mg.saveMetrics(metrics).then(resolve).catch(reject);
                    }
                  });
              });
        });
      }).catch(reject);
    });
  });
};
