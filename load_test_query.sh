function run_load_test {
    script_dir="scripts/query"
    script_name=$3
    script_path="$script_dir/$script_name"

    test_dir="$(date +"%Y-%m-%dT%H-%M-%S")"
    test_path="tests/$test_dir"
    $(mkdir -p $test_path)

    limit=$1

    target_vu=$2
    vu_increment=100
    attempt_count=3

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
            exit 1
        fi

        # double check result
        result=$(cat $result_file_path | jq '.metrics.http_req_duration.thresholds."p(95)<500".ok')
        echo "$result"
        if [ "$result" != true ]; then
            break
        fi

        # update target VU
        target_vu=$((target_vu + vu_increment))
    done
}

function run_test {
    for f in "queryVenue.js" "queryVenueMeetup.js" "queryMeetupMember.js"; do
        run_load_test $1 $2 $f
    done
}

function main() {
    if [ -z "$1" ]; then
        echo "Usage: ./load_test_query.sh [LIMIT] [TARGET VU]"
    else
        run_test $1 $2
    fi
}

main $1 $2
