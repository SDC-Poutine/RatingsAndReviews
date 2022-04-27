import http from 'k6/http';
import { sleep } from 'k6';

export const options = { // configuration of test execution
  // vus: 1000, // there are n amount of virtual users
  // duration: '10s', // duration of running the k6 script test
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '15s', target: 100 }, // below normal load
    { duration: '30s', target: 100 },
    { duration: '90s', target: 0 }, // scale down. Recovery stage.
  ],
};

export default function () { // function that runs over and over again as long as the test is still running by the number of VUS.
  const BASE_URL = 'http://localhost:3000/reviews'; // make sure this is not production

  const responses = http.batch([ // make 2 requests to get if i were to run the function once
    ['GET', `${BASE_URL}?product_id=1000011`],
  ]);

  sleep(0.01); // suspend VU execution for specified duration
}