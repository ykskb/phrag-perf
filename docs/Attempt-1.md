# Attempt #1

## Environment

* Phrag server: AWS ECS

  Task CPU: `2 vCPU` | Task Memory: `4 GB` | JVM version: `11`

* Database: RDS (Postgres) Free tier

  Instance Class: `db.t3.micro` | vCPU: `2 vCPU` | RAM: `1 GB`

* Request Origin running k6: Mac Studio

  Chip: `M1 Max` | CPU Core `10` | Memory: `32 GB` | 

## Mutations

### createVenue.js

Result: `450` to `500` VUs

#### Target: `450` VUs

* Request Duration 

  * p(95): `457.88 ms`
  * avg: `249.62 ms`

* Request Count: 

  * total: `16423`
  * per second: `267.6`

```
     data_received..................: 3.2 MB 51 kB/s
     data_sent......................: 7.0 MB 114 kB/s
     http_req_blocked...............: avg=288.51µs min=1µs    med=8µs      max=1s       p(90)=11µs     p(95)=21µs    
     http_req_connecting............: avg=274.57µs min=0s     med=0s       max=1s       p(90)=0s       p(95)=0s      
   ✓ http_req_duration..............: avg=249.62ms min=8.17ms med=272.23ms max=778.53ms p(90)=423.52ms p(95)=475.88ms
       { expected_response:true }...: avg=249.62ms min=8.17ms med=272.23ms max=778.53ms p(90)=423.52ms p(95)=475.88ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 16423
     http_req_receiving.............: avg=78.65µs  min=7µs    med=57µs     max=16.47ms  p(90)=104µs    p(95)=141µs   
     http_req_sending...............: avg=52.68µs  min=5µs    med=33µs     max=5.68ms   p(90)=59µs     p(95)=118µs   
     http_req_tls_handshaking.......: avg=0s       min=0s     med=0s       max=0s       p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=249.49ms min=8.09ms med=272.11ms max=778.3ms  p(90)=423.38ms p(95)=475.57ms
     http_reqs......................: 16423  267.632497/s
     iteration_duration.............: avg=1.25s    min=1s     med=1.27s    max=2.13s    p(90)=1.42s    p(95)=1.47s   
     iterations.....................: 16423  267.632497/s
     vus............................: 99     min=15       max=450
     vus_max........................: 450    min=450      max=450
```

#### Target: `500` VUs

* Request Duration 

  * p(95): `646.82 ms`
  * avg: `362.84 ms`

* Request Count: 

  * total: `16756`
  * per second: `273`

```
     data_received..................: 3.2 MB 52 kB/s
     data_sent......................: 7.1 MB 116 kB/s
     http_req_blocked...............: avg=222.49µs min=0s     med=8µs      max=55.5ms   p(90)=11µs     p(95)=21µs    
     http_req_connecting............: avg=209.37µs min=0s     med=0s       max=55.37ms  p(90)=0s       p(95)=0s      
   ✗ http_req_duration..............: avg=362.84ms min=8.12ms med=418.74ms max=927.7ms  p(90)=590.87ms p(95)=646.82ms
       { expected_response:true }...: avg=362.84ms min=8.12ms med=418.74ms max=927.7ms  p(90)=590.87ms p(95)=646.82ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 16756
     http_req_receiving.............: avg=72.04µs  min=8µs    med=59µs     max=4.86ms   p(90)=101µs    p(95)=127µs   
     http_req_sending...............: avg=51.81µs  min=4µs    med=33µs     max=3.8ms    p(90)=58µs     p(95)=106µs   
     http_req_tls_handshaking.......: avg=0s       min=0s     med=0s       max=0s       p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=362.71ms min=8.04ms med=418.6ms  max=927.47ms p(90)=590.7ms  p(95)=646.72ms
     http_reqs......................: 16756  273.063314/s
     iteration_duration.............: avg=1.36s    min=1s     med=1.41s    max=1.94s    p(90)=1.59s    p(95)=1.64s   
     iterations.....................: 16756  273.063314/s
     vus............................: 153    min=17       max=500
     vus_max........................: 500    min=500      max=500
```