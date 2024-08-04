import MetaDescResolver from './MetaDescResolver'

export default class StringSlotContentResolver extends MetaDescResolver {
  resolveDesc (desc) {
    if (desc.content && typeof desc.content === 'string') {
      desc.content = new Function('scope', `return ${desc.content}`)
    }
    if (desc.slots) {
      Object.keys(desc.slots).forEach(key => {
        const slotValue = desc.slots[key]
        if (typeof slotValue === 'string') {
          desc.slots[key] = new Function('scope', `return ${desc.slots[key]}`)
        }
      })
    }
  }
}
