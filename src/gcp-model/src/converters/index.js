function getOrCreateConverter (type, creator) {
  return creator()
}

function createDocConverter (docType) {
  return (value) => {
    if (!value) {
      return null
    }
    return docType.of(value)
  }
}

export function getPropertyConverter (property) {
  if (property.type === 'doc') {
    const docType = property.docType
    return getOrCreateConverter(docType, () => createDocConverter(docType))
  } else {
    return null
  }
}
