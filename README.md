# lab5-k6

Load testing with k6 by Matan Haver

Used the following web API `https://jsonplaceholder.typicode.com/`  
a free fake REST API suitable for functional and load testing tasks

## Test result

A total of `11,691` HTTP `429 Too Many Requests` responses were observed, indicating that the API rate limiting mechanism was actively protecting the service from excessive request bursts rather than failing unexpectedly.

```text
PS C:\Users\matan\Desktop\repos\sce\lab5-k6> k6 run script.js

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/


     execution: local
        script: script.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 15m30s max duration (incl. graceful stop):
              * default: 10 looping VUs for 15m0s (gracefulStop: 30s)



  █ THRESHOLDS

    checks
    ✗ 'rate>0.95' rate=55.22%

    http_req_duration
    ✓ 'p(95)<800' p(95)=189.88ms

    http_req_failed
    ✗ 'rate<0.01' rate=51.61%


  █ TOTAL RESULTS

    checks_total.......: 63344  70.225878/s
    checks_succeeded...: 55.22% 34982 out of 63344
    checks_failed......: 44.77% 28362 out of 63344

    ✗ user_ok
      ↳  56% — ✓ 2218 / ✗ 1741
    ✗ posts_ok
      ↳  54% — ✓ 2167 / ✗ 1792
    ✗ post_ok
      ↳  49% — ✓ 1955 / ✗ 2004
    ✗ comments_ok
      ↳  44% — ✓ 1769 / ✗ 2190
    ✗ comment_ok
      ↳  40% — ✓ 1592 / ✗ 2367
    ✗ id_valid
      ↳  56% — ✓ 2218 / ✗ 1741
    ✗ post_id_valid
      ↳  54% — ✓ 2167 / ✗ 1792
    ✗ email_valid
      ↳  56% — ✓ 2218 / ✗ 1741
    ✗ username_valid
      ↳  56% — ✓ 2218 / ✗ 1741
    ✗ user_post_match
      ↳  47% — ✓ 1879 / ✗ 2080
    ✗ post_comment_match
      ↳  89% — ✓ 3561 / ✗ 398
    ✗ comment_post_match
      ↳  85% — ✓ 3384 / ✗ 575
    ✗ posts_exist
      ↳  54% — ✓ 2167 / ✗ 1792
    ✗ comments_exist
    ✗ products_category_valid
      ↳  46% — ✓ 1850 / ✗ 2109

    CUSTOM
    rate_limited_429...............: 11691  12.961145/s

    HTTP
    http_req_duration..............: avg=181.89ms min=121.79ms med=157.48ms max=5.03s p(90)=175.58ms p(95)=189.88ms
      { expected_response:true }...: avg=204.22ms min=123.67ms med=159.12ms max=5.03s p(90)=182.51ms p(95)=203.52ms
    http_req_failed................: 51.61% 14304 out of 27713
    http_reqs......................: 27713  30.723822/s

    EXECUTION
    iteration_duration.............: avg=2.27s    min=2.03s    med=2.09s    max=7.16s p(90)=2.19s    p(95)=2.36s
    iterations.....................: 3959   4.389117/s
    vus............................: 1      min=1              max=10
    vus_max........................: 10     min=10             max=10

    NETWORK
    data_received..................: 49 MB  54 kB/s
    data_sent......................: 1.2 MB 1.4 kB/s




running (15m02.0s), 00/10 VUs, 3959 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  15m0s
ERRO[0902] thresholds on metrics 'checks, http_req_failed' have been crossed
```
