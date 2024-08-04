import MetaDescResolver from './MetaDescResolver'
import { buildDataSource, isObject, isDataSource } from '../utils'

export default class DataSourceResolver extends MetaDescResolver {
  constructor (dataSourceDefs) {
    super()
    this.dataSourceDefs = dataSourceDefs
    this.widgetRegExp = /["|'](billQueryId|QueryFilter-\w+)["|']/g
  }

  resolveDesc (desc) {
    if (!desc) {
      return
    }
    const propKeyList = Object.keys(desc.props || {})
    for (const propKey of propKeyList) {
      const value = desc.props[propKey]
      if (typeof value === 'string' && value.startsWith('ds:')) {
        const dataSourceId = value.replace('ds:', '')
        delete desc.props[propKey]
        const dataSourceMeta = this.dataSourceDefs[dataSourceId].meta
        if (dataSourceMeta) {
          const dataSource = buildDataSource(dataSourceMeta)
          desc.props[`:${propKey}`] = dataSource
          const dataSourceRefWidgetIds = this.getRefWidgetIdList(dataSource)
          desc.props.dataSourceRefWidgetIds = dataSourceRefWidgetIds
          dataSource.dataSourceRefWidgetIds = dataSourceRefWidgetIds
        }
      } else if (isDataSource(value)) {
        console.log('todo================')
      }
    }
  }

  getRefWidgetIdList (dataSource) {
    if (Array.isArray(dataSource.dataSourceRefWidgetIds) && dataSource.dataSourceRefWidgetIds.length) {
      return dataSource.dataSourceRefWidgetIds
    }
    const queryDef = dataSource.queryDef || dataSource[':queryDef']
    const matchValueList = []
    if (typeof queryDef === 'string') {
      matchValueList.push(queryDef)
    } else if (isObject(queryDef)) {
      const params = queryDef.params || queryDef[':params']
      if (typeof params === 'string') {
        matchValueList.push(params)
      } else if (isObject(params)) {
        matchValueList.push(...Object.keys(params))
      }
    }
    return matchValueList.reduce((pre, cur) => {
      const matchList = [...cur.matchAll(this.widgetRegExp)]
      for (const item of matchList) {
        const widgetId = item?.[1]
        if (widgetId && !pre.includes(widgetId)) {
          pre.push(widgetId)
        }
      }
      return pre
    }, [])
  }
}
