test_dir="$(date +"%Y-%m-%dT%H-%M-%S")"
test_path="tests/$test_dir"

function run_load_test {
    script_dir="scripts/query"
    script_name=$1
    script_path="$script_dir/$script_name"

    limit=$2

    target_vu=$3
    vu_increment=100
    attempt_count=4

    echo "Running test with $script_path..."
    for i in $(seq $attempt_count); do
        result_file_name="$script_name-limit-$limit-vu-$target_vu.json"
        result_file_path="$test_path/$result_file_name"
        env_file_path="RESULT_FILE_PATH=$result_file_path"
        env_target_vu="TARGET_VU=$target_vu"
        env_limit="ITEM_LIMIT=$limit"

        echo "File: $script_name Target VU: $target_vu"
        command="k6 run -e $env_file_path -e $env_target_vu -e $env_limit $script_path"
        echo $command
        $command

        # if any of thresholds fails, failure exit code will be returned
        status="$?"
        if [ $status -gt 0 ]; then
            echo "k6 failed $status"
            break
        fi

        # double check result
        echo
        echo "----- Summary -----"
        result=$(cat $result_file_path | jq '.metrics.http_req_duration.thresholds."p(95)<500".ok')
        echo
        echo "HTTP Request Duration p(95)<500 Pass: $result"
        if [ "$result" != true ]; then
            break
        fi

        p_duration=$(cat $result_file_path | jq '.metrics.http_req_duration.values."p(95)"')
        avg_duration=$(cat $result_file_path | jq '.metrics.http_req_duration.values.avg')
        echo
        echo "HTTP Request Duration"
        echo "p(95): $p_duration avg: $avg_duration"

        req_count=$(cat $result_file_path | jq '.metrics.http_reqs.values.count')
        req_rate=$(cat $result_file_path | jq '.metrics.http_reqs.values.rate')
        echo
        echo "HTTP Requests: count: $req_count rate: $req_rate/s"
        echo "--------------------"

        # update target VU
        target_vu=$((target_vu + vu_increment))
        sleep 5
    done
}

function run_tests {
    no_nest="queryVenue.js"
    one_nest="queryVenueMeetup.js"
    two_nest="queryMeetupMember.js"

    $(mkdir -p $test_path)

    # 4GB 1CPU
    # run_load_test $no_nest 50 1300
    # run_load_test $no_nest 100 900
    # run_load_test $one_nest 50 700
    # run_load_test $one_nest 100 400
    # run_load_test $two_nest 50 500
    # run_load_test $two_nest 100 300

    # 8GB 2CPU
    # run_load_test $no_nest 50 2000
    # run_load_test $no_nest 100 2000
    # run_load_test $one_nest 50 1400
    # run_load_test $one_nest 100 900
    # run_load_test $two_nest 50 1200
    # run_load_test $two_nest 100 700
}

function main() {
    if [ -z "$1" ]; then
        echo "Usage: ./load_test_query.sh [FILENAME || all] [LIMIT] [TARGET VU]"
    elif [ "$1" = "all" ]; then
        run_tests
    else
        $(mkdir -p $test_path)
        run_load_test $1 $2 $3
    fi
}

main $1 $2 $3
