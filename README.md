# Load Tests for [Phrag](https://github.com/ykskb/phrag)

Tests are performed with [k6](https://k6.io).

### Run

Run each script manually:

```sh
k6 run path/to/script.js
```

Run incremental attempts:

```sh
./load_test_query.sh [FILENAME or "all"] [LIMIT] [TARGET VU]
```

- `4` stages will be attempted with `100` VU (virtual user) increase from a start VU target specified.

- `all` can be specified as the first argument to test a series of setups. `run_tests` function in `load_test_query.sh` should be edited to specify the list of tests in this case.

- Results of these tests will be generated under `tests/[TIMESTAMP]/[FILENAME].json` by default.

### Environment Variables

- `BASE_URL`: Required. Base URL of a target service.
- `ITEM_LIMIT`: Optional. Defaults to `100`.
- `TARGET_VU`: Optional. Defaults to `100`.
- `RESULT_FILE_PATH`: Optional. Defaults to `results/[FILENAME].json`.
- `RESULT_FILE_NAME`: Optional. Defaults to `[FILENAME].json`.

### Measurements

Results are summarized at [performance page](https://github.com/ykskb/phrag/blob/main/docs/performance.md) of Phrag's documentation.
