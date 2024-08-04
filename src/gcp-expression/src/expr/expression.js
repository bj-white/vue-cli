import Parser from './parser'
import EvalContext from './context'
import LRUCache from '../utils/lru-cache'

class Expression {
  constructor(expr) {
    this.evalFunc = new Parser(expr).parse()
  }

  evaluate(context) {
    if (!context) {
      throw new Error('context not provided')
    }
    if (context.getEvalContext) {
      context = context.getEvalContext()
    } else if (!(context instanceof EvalContext)) {
      context = EvalContext.of(context)
    }
    return this.evalFunc(context)
  }
}

const MAX_CACHE_COUNT = 100
const cache = new LRUCache(MAX_CACHE_COUNT)

Expression.of = function(expr) {
  let item = cache.get(expr)
  if (item == null) {
    item = new Expression(expr)
    cache.put(expr, item)
  }
  return item
}

export default Expression
