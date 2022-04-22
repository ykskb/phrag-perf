import { sleep } from "k6";
import http from "k6/http";

const gqlUrl = __ENV.BASE_URL + "/graphql";
const meetupMaxId = 1000;
const memberMaxId = 1000;
const params = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const create = () => {
  const query = `
  mutation createMeetupMemberMutation ($meetup_id: Int!, $member_id: Int! ) {
    createMeetupsMember (meetup_id: $meetup_id, member_id: $member_id) { meetup_id member_id }}
  }
  `;
  const variables = {
    meetup_id: getRandomInt(0, meetupMaxId),
    member_id: getRandomInt(0, memberMaxId),
  };
  const payload = JSON.stringify({ query, variables });
  http.post(gqlUrl, payload, params);
};

export const options = {
  stages: [
    { duration: "1m", target: 300 },
    { duration: "1m", target: 300 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  create();
  sleep(1);
}
