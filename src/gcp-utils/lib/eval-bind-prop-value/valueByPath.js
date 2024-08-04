export default function valueByPath (data, path) {
  if (!path) {
    return data
  }
  const paths = path.split('.')
  let result = data
  for (const path of paths) {
    result = result[path]
  }
  return result
}
