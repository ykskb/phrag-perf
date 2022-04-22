import { sleep } from "k6";
import http from "k6/http";

const targetVU = 300;

const gqlUrl = __ENV.BASE_URL + "/graphql";
const startAtCandidates = [
  "2022-04-23 18:00:00",
  "2022-08-01 09:00:00",
  "2022-09-15 13:00:00",
  "2022-10-01 09:00:00",
  "2022-12-01 09:00:00",
];
const venueMaxId = 1000;
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

const createMeetup = () => {
  const query = `
  mutation createMeetupMutation ($title: String!, $start_at: String! $venue_id: Int! ) {
    createMeetup (title: $title, start_at: $start_at, venue_id: $venue_id) {
      id
    }
  }
  `;
  const randomStr = randomString(8);
  const startAtIndex = getRandomInt(0, startAtCandidates.length);
  const variables = {
    title: randomStr,
    start_at: startAtCandidates[startAtIndex],
    venue_id: getRandomInt(0, venueMaxId),
  };
  const payload = JSON.stringify({ query, variables });
  http.post(gqlUrl, payload, params);
};

export const options = {
  stages: [
    { duration: "30s", target: targetVU },
    { duration: "30s", target: targetVU },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  createMeetup();
  sleep(1);
}
