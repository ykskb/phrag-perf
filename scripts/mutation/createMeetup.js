import { sleep } from "k6";
import http from "k6/http";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Variables

const title = "create-meetup";
const gqlUrl = __ENV.BASE_URL + "/graphql";

const queryIntervalSecs = 1;
const targetVU = parseInt(__ENV.TARGET_VU) || 100;
const venueMaxId = 100000;
const startAtCandidates = [
  "2022-04-23T18:00:00",
  "2022-08-01T09:00:00",
  "2022-09-15T13:00:00",
  "2022-10-01T09:00:00",
  "2022-12-01T09:00:00",
];
const query = `
  mutation createMeetupMutation ($title: String!, $start_at: String! $venue_id: Int! ) {
    createMeetup (title: $title, start_at: $start_at, venue_id: $venue_id) {
      id
    }
  }`;

// Result Output

export function handleSummary(data) {
  data["target_vu"] = targetVU;
  data["target_host"] = __ENV.BASE_URL;

  let resultFilePath = __ENV.RESULT_FILE_PATH;
  let resultFileName = __ENV.RESULT_FILE_NAME;
  if (!resultFilePath && !resultFileName) {
    const d = new Date();
    const dStr = `${d.getFullYear()}-${
      d.getMonth() + 1
    }-${d.getDate()}T${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
    resultFileName = `${title}-${dStr}.json`;
    resultFilePath = `results/${resultFileName}`;
  }

  const config = {};
  config[resultFilePath] = JSON.stringify(data);
  config["stdout"] = textSummary(data, { indent: " ", enableColors: true });
  return config;
}

// Config

export const options = {
  stages: [
    { duration: "30s", target: targetVU },
    { duration: "30s", target: targetVU },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
    errorRate: [
      { threshold: "rate<0.01", abortOnFail: true, delayAbortEval: "1s" },
    ],
  },
};

// Execution

const params = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const randomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const errorRate = new Rate("errorRate");

const createMeetup = () => {
  const randomStr = randomString(8);
  const startAtIndex = getRandomInt(0, startAtCandidates.length);
  const variables = {
    title: randomStr,
    start_at: startAtCandidates[startAtIndex],
    venue_id: getRandomInt(1, venueMaxId),
  };
  const payload = JSON.stringify({ query, variables });
  const r = http.post(gqlUrl, payload, params);
  const d = r.json();
  if (d["errors"] || !d.hasOwnProperty("data")) {
    errorRate.add(1);
  } else {
    errorRate.add(0);
  }
};

export default function () {
  createMeetup();
  sleep(queryIntervalSecs);
}
