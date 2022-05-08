# Performance Evaluation for RDB Grapher

Tests are performed with [k6](https://k6.io).

### Environment Variables

- `BASE_URL`: Required. Base URL of a target service.
- `ITEM_LIMIT`: Optional. Defaults to `100`.
- `TARGET_VU`: Optional. Defaults to `100`.
- `RESULT_FILE_PATH`: Optional. Defaults to `results/[FILENAME].json`.
- `RESULT_FILE_NAME`: Optional. Defaults to `[FILENAME].json`.

### Run

Run each script manually:

```sh
k6 run path/to/script.js
```

Run incremental attempts:

Results of these tests will be generated under `tests/[TIMESTAMP]/[FILENAME].json`.

```sh
./load_test_query.sh [LIMIT] [TARGET VU]
```

### Measurement #1

<u>How many users</u> can be served with `request duration`: `p(95)<500`? (`95%` of request duration is less than `500ms`)

- Each user sends a request every `1s` for entire duration of a test.
- 2 stages of requests:
  1. `30s` of ramping up to a target number of users
  2. `30s` of staying at a target number of users
