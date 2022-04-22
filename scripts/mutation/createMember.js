import { sleep } from "k6";
import http from "k6/http";

const gqlUrl = __ENV.BASE_URL + "/graphql";
const params = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
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

const createMember = () => {
  const query = `
      mutation createEnduserMutation(
        $email: String!
        $first: String!
        $last: String!
      ) {
        createMember(email: $email, first_name: $first, last_name: $last) {
          id
        }
      }
    `;
  const randomStr = randomString(8);
  const variables = {
    email: randomStr,
    first: randomStr,
    last: randomStr,
  };
  const payload = JSON.stringify({ query, variables });
  http.post(gqlUrl, payload, params);
};

export const options = {
  stages: [
    { duration: "30s", target: 100 },
    { duration: "30s", target: 100 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  createMember();
  sleep(1);
}
