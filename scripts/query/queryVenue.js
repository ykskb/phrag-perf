import { sleep } from "k6";
import http from "k6/http";

const gqlUrl = __ENV.BASE_URL + "/graphql";
const params = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
const maxLimit = 100;
const maxOffset = 100;
const maxVenueId = 1000;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const sendQuery = () => {
  const query = `
  query myQuery ($limit:Int!, $offset:Int!, $id_gt:Int!) {
	  venues (limit: $limit, offset:$offset, where: {id: {gt: $id_gt}}) {
		  id name postal_code
		}
	}`;
  const variables = {
    limit: getRandomInt(0, maxLimit),
    offset: getRandomInt(0, maxOffset),
    id_gt: getRandomInt(0, maxVenueId),
  };
  const payload = JSON.stringify({ query, variables });
  http.post(gqlUrl, payload, params);
};

export const options = {
  stages: [{ duration: "30s", target: 70 }],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  sendQuery();
  sleep(1);
}