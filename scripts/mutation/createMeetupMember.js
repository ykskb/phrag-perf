import { sleep } from "k6";
import http from "k6/http";

// Variables

const title = "create-meetup";
const gqlUrl = __ENV.BASE_URL + "/graphql";

const queryIntervalSecs = 1;
const targetVU = __ENV.TARGET_VU || 100;
const meetupMaxId = 100000;
const memberMaxId = 100000;
const query = `
  mutation createMeetupMemberMutation ($meetup_id: Int!, $member_id: Int! ) {
    createMeetupsMember (meetup_id: $meetup_id, member_id: $member_id) { meetup_id member_id }}
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

const errorRate = new Rate("errorRate");

const create = () => {
  const variables = {
    meetup_id: getRandomInt(1, meetupMaxId),
    member_id: getRandomInt(1, memberMaxId),
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
  create();
  sleep(queryIntervalSecs);
}
