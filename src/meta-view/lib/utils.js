import { isObject, hasOwnProperty } from '../../gcp-utils/lib/assert'

const isBindExpr = value => {
  return typeof value === 'string' && !!value && value.startsWith('${') && value.endsWith('}')
}

const removeExprBracket = value => {
  return isBindExpr(value) ? value?.replace(/(^\${)|(}$)/g, '') : value
}

const buildParams = params => {
  let paramStr = '{\n'
  if (Array.isArray(params)) {
    for (let i = 0; i < params.length; i++) {
      const { name, value } = params[i]
      const _value = removeExprBracket(value)
      paramStr +=
        ` '${name}' : ` +
        (isBindExpr(value) ? `${_value}` : !_value ? "''" : typeof _value === 'string' ? `'${_value}'` : _value) +
        (i < params.length - 1 ? ',\n' : '\n')
    }
  }
  paramStr += '}'
  return paramStr
}

const buildQueryDef = dataSourceMeta => {
  const {actionCode, gobjectFname, extParam, params, data, type, method, url, config} = dataSourceMeta
  const paramList = Array.isArray(params) ? params : []
  const _extParam = removeExprBracket(extParam)
  const _data = removeExprBracket(data)
  const headerParamList = paramList.filter(v => v.position === 'Header')
  const otherParamList = paramList.filter(v => v.position !== 'Header')
  const headers = buildParams(headerParamList)
  const otherParams = buildParams(otherParamList)
  const uniqueParams =
    type === 'doc'
      ? `{ docName: '${gobjectFname}', method: '${actionCode}'}`
      : type === 'ajax'
      ? `{ url: '${url}', method: '${method}' }`
      : '{}'
  const { prioritizedApiMap = true } = config || {}
  return `#function(scope) {
    var context = this.context
    var store = this.store
    var ref = this.ref
    var { dataModel, isReadonly } = scope || {}
    dataModel = dataModel || this.dataModel || {}
    var extParam = ${_extParam}
    extParam = Object.prototype.toString.call(extParam) === '[object Object]' ? extParam : {}
    var data = ${_data}
    data = (Object.prototype.toString.call(data) === '[object Object]' || Array.isArray(data)) ? data : undefined
    const queryRes = {
      params: {},
      headers: ${headers},
      data: data,
      _config: {
        prioritizedApiMap: ${prioritizedApiMap}
      },
      options: {
        readonly: true
      }
    }
    if (Object.keys(${uniqueParams}).length) {
      for (const key in ${uniqueParams}) {
        queryRes[key] = ${uniqueParams}[key]
      }
    }
    if (Object.keys(${otherParams}).length) {
      for (const key in ${otherParams}) {
        queryRes.params[key] = ${otherParams}[key]
      }
    }
    if (Object.keys(extParam).length) {
      for (const key in extParam) {
        queryRes.params[key] = extParam[key]
      }
    }
    return queryRes
  }`
}

const buildDataSource = dataSourceMeta => {
  const { code, preload, autoLoad, requestHooks, type } = dataSourceMeta
  return {
    name: code,
    type,
    queryDef: buildQueryDef(dataSourceMeta),
    options: {
      preload,
      autoLoad
    },
    requestHooks
  }
}

const isDataSource = obj => {
  return (
    hasOwnProperty(obj, 'name') &&
    hasOwnProperty(obj, 'type') &&
    (hasOwnProperty(obj, 'queryDef') || hasOwnProperty(obj, ':queryDef'))
  )
}

export { buildDataSource, isObject, isDataSource }
