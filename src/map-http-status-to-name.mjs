// We considered using something like 'http-status' (https://www.npmjs.com/package/http-status), but it would add a 
// bunch of unnecessary codes. I.e., errors don't need 1xx, 2xx, or 3xx codes since those represent non-error statuses.

const defaultMappings = {
  400 : 'Bad Request',
  401 : 'Unauthorized',
  402 : 'Payment Required',
  403 : 'Forbidden',
  404 : 'Not Found',
  405 : 'Method Not Allowed',
  406 : 'Not Acceptable',
  407 : 'Proxy Authentication Required',
  408 : 'Request Timeout',
  409 : 'Conflict',
  410 : 'Gone',
  411 : 'Length Required',
  412 : 'Precondition Failed',
  413 : 'Content Too Large',
  414 : 'URI Too Long',
  415 : 'Unsupported Media Type',
  416 : 'Range Not Satisfiable',
  417 : 'Expectation Failed',
  418 : '(Unused)',
  421 : 'Misdirected Request',
  422 : 'Unprocessable Content',
  423 : 'Locked',
  424 : 'Failed Dependency',
  425 : 'Too Early',
  426 : 'Upgrade Required',
  428 : 'Precondition Required',
  429 : 'Too Many Requests',
  431 : 'Request Header Fields Too Large',
  440 : 'Login Time Out', // extended code from IIS
  444 : 'No Response', // extended code from Nginx
  451 : 'Unavailable For Legal Reasons',
  500 : 'Internal Server Error',
  501 : 'Not Implemented',
  502 : 'Bad Gateway',
  503 : 'Service Unavailable',
  504 : 'Gateway Timeout',
  505 : 'HTTP Version Not Supported',
  506 : 'Variant Also Negotiates',
  507 : 'Insufficient Storage',
  508 : 'Loop Detected',
  510 : 'Not Extended', // OBSOLETE
  511 : 'Network Authentication Required',
  540 : 'Unknown Error' // extended code from Cloudflair
}

const customMappings = {}

const mapHttpStatusToName = (status, name) => {
  if (status === undefined) {
    for (const prop in customMapping) {
      delete customMapping[prop]
    }
  } else if (name === undefined) {
    return customMappings[status] || defaultMappings[status] || 'Unassigned'
  } else {
    customMapping[status] = name
  }
}

export { mapHttpStatusToName }
