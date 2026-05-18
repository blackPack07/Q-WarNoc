import encoding from 'k6/encoding';
import http from 'k6/http';
import { check } from 'k6';

const config = JSON.parse(open('../EnvironmentSetup.json'));

const username = config.username;
const password = config.password;


export default function () {
  const credentials = `${username}:${password}`;

  // Passing username and password as part of the URL will
  // allow us to authenticate using HTTP Basic Auth.
  const url = config.BASE_URL + `/api/basic-auth/${username}/${password}`;

  let res = http.get(url);

  // Verify response
  check(res, {
    'status is 200': (r) => r.status === 200,
    'is authenticated': (r) => r.json().authenticated === true,
    'is correct user': (r) => r.json().user === username,
  });

  // Alternatively you can create the header yourself to authenticate
  // using HTTP Basic Auth
  const encodedCredentials = encoding.b64encode(credentials);
  const options = {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  };

  res = http.get(`${config.BASE_URL}/api/basic-auth/${username}/${password}`, options);

  // Verify response (checking the echoed data from the QuickPizza
  // basic auth test API endpoint)
  check(res, {
    'status is 200': (r) => r.status === 200,
    'is authenticated': (r) => r.json().authenticated === true,
    'is correct user': (r) => r.json().user === username,
  });
}

export function handleSummary(data) {
    return {
        // it will overwrite this file every time!
        "reports/warnoc_performance_report.html": htmlReport(data),
    };
}