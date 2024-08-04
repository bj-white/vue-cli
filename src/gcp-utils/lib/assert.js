const isEmpty = value => {
  return (
    value === '' ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0) ||
    (isObject(value) && Object.keys(value).length === 0)
  )
}

const isNaturalNumber = value => {
  return typeof value === 'number' && value >= 0
}

const isObject = value => {
  return Object.prototype.toString.call(value) === '[object Object]'
}

const hasOwnProperty = (obj, key) => {
  return isObject(obj) ? Object.prototype.hasOwnProperty.call(obj, key) : false
}

export { isEmpty, isNaturalNumber, isObject, hasOwnProperty }
