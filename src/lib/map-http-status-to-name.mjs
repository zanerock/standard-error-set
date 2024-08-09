// We considered using something like 'http-status' (https://www.npmjs.com/package/http-status), but it would add a 
// bunch of unnecessary codes. I.e., errors don't need 1xx, 2xx, or 3xx codes since those represent non-error statuses.

const mappings = {
  400 : 'Bad Request',
  401 : 'Unauthorized',
  402 : 'Payment Required',
  403 : 'Forbidden',
  404 : 'Not Found',
  405 : 'Method Not Allowed',
  406 : 'Not Acceptable'
}
/*
407 Proxy Authentication Required [RFC9110, Section 15.5.8]
408 Request Timeout [RFC9110, Section 15.5.9]
409 Conflict  [RFC9110, Section 15.5.10]
410 Gone  [RFC9110, Section 15.5.11]
411 Length Required [RFC9110, Section 15.5.12]
412 Precondition Failed [RFC9110, Section 15.5.13]
413 Content Too Large [RFC9110, Section 15.5.14]
414 URI Too Long  [RFC9110, Section 15.5.15]
415 Unsupported Media Type  [RFC9110, Section 15.5.16]
416 Range Not Satisfiable [RFC9110, Section 15.5.17]
417 Expectation Failed  [RFC9110, Section 15.5.18]
418 (Unused)  [RFC9110, Section 15.5.19]
419-420 Unassigned  
421 Misdirected Request [RFC9110, Section 15.5.20]
422 Unprocessable Content [RFC9110, Section 15.5.21]
423 Locked  [RFC4918]
424 Failed Dependency [RFC4918]
425 Too Early [RFC8470]
426 Upgrade Required  [RFC9110, Section 15.5.22]
427 Unassigned  
428 Precondition Required [RFC6585]
429 Too Many Requests [RFC6585]
430 Unassigned  
431 Request Header Fields Too Large [RFC6585]
432-450 Unassigned  
451 Unavailable For Legal Reasons [RFC7725]
452-499 Unassigned  
500 Internal Server Error [RFC9110, Section 15.6.1]
501 Not Implemented [RFC9110, Section 15.6.2]
502 Bad Gateway [RFC9110, Section 15.6.3]
503 Service Unavailable [RFC9110, Section 15.6.4]
504 Gateway Timeout [RFC9110, Section 15.6.5]
505 HTTP Version Not Supported  [RFC9110, Section 15.6.6]
506 Variant Also Negotiates [RFC2295]
507 Insufficient Storage  [RFC4918]
508 Loop Detected [RFC5842]
509 Unassigned  
510 Not Extended (OBSOLETED)  [RFC2774][status-change-http-experiments-to-historic]
511 Network Authentication Required [RFC6585]
512-599 Unassigned 
*/
/*
Extras:
440: Login Time Out (from IIS)
444: No Response (from Nginx)
540: Unknown Error (from Cloudflare; this seems redundant with plain 500)
*/

const mapHTTPStatusToName = (status) => mappings[status]

export { mapHTTPStatusToName }
