import functions from './functions'

class EvalContext {
  constructor() {
    this.nil = null
  }

  from(data) {
    const context = Object.create(this)
    Object.assign(context, data)
    this.initContext(context)
    return context
  }

  initContext(context) {
    Object.assign(context, functions)
  }
}

const evalContext = new EvalContext()

EvalContext.of = function(data) {
  return evalContext.from(data)
}

export default EvalContext
