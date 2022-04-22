# Performance Evaluation for RDB Grapher

Tests are performed with [k6](https://k6.io).

### Measurement #1

`How many users` can be served with `request duration`: `p(95)<500` (`95%` of request duration is less than `500ms`) under these settings below:

- Each user sends a request every `1s` for entire duration of a test.
- 2 stages of requests:
  1. `30s` of ramp-up to a target number of users
  2. `30s` of stay at the target number of users
