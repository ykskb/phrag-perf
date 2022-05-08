import { sleep } from "k6";
import http from "k6/http";
import { Rate } from "k6/metrics";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Variables

const title = "query-meetup-member";
const gqlUrl = __ENV.BASE_URL + "/graphql";

const queryIntervalSecs = 2;
const targetVU = parseInt(__ENV.TARGET_VU) || 100;
const limit = parseInt(__ENV.ITEM_LIMIT) || 100;
const maxOffset = 100;
const maxVenueId = 100000;
const query = `
  query myQuery ($limit: Int!, $offset: Int!, $id_gt: Int!) {
    meetups (limit: $limit, offset: $offset where:{id: {gt: $id_gt}}) {
      id title meetups_members (limit: $limit) {
        member {
          id email
        }
      }
    }
  }`;

// Result Output

export function handleSummary(data) {
  data["limit"] = limit;
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

const errorRate = new Rate("errorRate");

const sendQuery = () => {
  const variables = {
    limit: limit,
    offset: getRandomInt(0, maxOffset),
    id_gt: getRandomInt(0, maxVenueId),
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
  sendQuery();
  sleep(queryIntervalSecs);
}
