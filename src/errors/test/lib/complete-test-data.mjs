const defaultFillLength = 5

const completeTestData = ({
  testData,
  defaultCode,
  defaultStatus,
  fillLength = defaultFillLength,
}) =>
  testData.map((record) => {
    if (record.length === 2) {
      record.push(defaultStatus)
    }
    if (typeof record[2] !== 'number') {
      record.splice(2, 0, defaultStatus)
    }
    while (record.length < fillLength) {
      record.push(record.length === 4 ? defaultCode : undefined)
    }

    return record
  })

export { completeTestData }
