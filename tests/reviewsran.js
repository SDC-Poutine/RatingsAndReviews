import http from 'k6/http';
import { sleep } from 'k6';

export const options = { // configuration of test execution
  // vus: 1000, // there are n amount of virtual users
  // duration: '10s', // duration of running the k6 script test
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '10s', target: 100 }, // below normal load
    { duration: '30s', target: 100 },
    { duration: '10s', target: 200 }, // normal load
    { duration: '30s', target: 200 },
    { duration: '10s', target: 300 }, // around the breaking point
    { duration: '30s', target: 300 },
    { duration: '10s', target: 400 }, // beyond the breaking point
    { duration: '30s', target: 400 },
    { duration: '10s', target: 1000 }, // testing to the limit
    { duration: '30s', target: 1000 },
    { duration: '1m', target: 0 }, // scale down. Recovery stage.
  ],
};

export default function () { // function that runs over and over again as long as the test is still running by the number of VUS.
  const BASE_URL = 'http://localhost:3000/reviews'; // make sure this is not production

  const responses = http.batch([ // make 2 requests to get if i were to run the function once
    ['GET', `${BASE_URL}?product_id=${Math.floor(Math.random() * (1000011 - (1000011*.1) + 1) + (1000011*.1))}`],
  ]);

  sleep(0.1); // suspend VU execution for specified duration
}