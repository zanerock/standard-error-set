const mappings = {
  400 : 'Bad Request'
}

const mapHTTPStatusToName = (status) => mappings[status]

export { mapHTTPStatusToName }
