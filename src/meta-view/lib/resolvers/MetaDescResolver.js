export default class MetaDescResolver {
  resolve (desc) {
    if (!desc) {
      return desc
    }
    this.resolveDesc(desc)
    if (desc.content) {
      console.log('todo===============')
    }
    if (desc.slots) {
      for (const slotName in desc.slots) {
        const slot = desc.slots[slotName]
        this.resolveSlot(slot)
      }
    }
  }

  resolveSlot (slot) {
    if (Array.isArray(slot)) {
      slot.forEach(desc => {
        this.resolve(desc)
      })
    } else {
      console.log('todo===============')
    }
  }
}
