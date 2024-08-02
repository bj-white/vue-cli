import applet from '../../../assets/applet.json'
import resourcePool from '../../../assets/resource-pool.json'
import { transformBaseUrlEnv, loadIconLibs } from './index'
import BillPage from '../../../web-template-bill/src/cores/bill/page'
import dynamicDownloadScript from '../dynamicDownloadScript'

let clientType
let offlinePluginList = []

const loadPlugins = async appletMetaJson => {
  let { plugins } = appletMetaJson.spec.config
  if (Array.isArray(plugins) && plugins.length) {
    plugins = plugins.sort((a, b) => {
      if (a.isCustom === b.isCustom) {
        return a.isOnline - b.isOnline
      } else {
        return a.isCustom - b.isCustom
      }
    })
    const pluginUrlList = plugins.reduce((pre, cur) => {
      let { exposePath, resourcePoolCode } = cur
      if (exposePath) {
        if (exposePath.startsWith('/') && resourcePoolCode) {
          let baseUrl = offlinePluginList.find(plugin => plugin.resourcePoolCode === resourcePoolCode)?.url || ''
          baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
          exposePath = baseUrl + exposePath
        }
        pre.push(exposePath)
      }
      return pre
    }, [])
    return await dynamicDownloadScript(pluginUrlList)
  }
}

const loadPage = async () => {
  class LocalPage extends BillPage {
    async init () {
      const appletMetaJson = await fetchAppletDesc()
      const [pluginResult] = await Promise.allSettled([
        loadPlugins(appletMetaJson)
      ])
      return { appConfig: appletMetaJson || null }
    }
  }
  return LocalPage
}

async function fetchAppletDesc () {
  const metaJson = appletMetaJson || (await fetchAppletMetaData())
  return metaJson
}

async function fetchRemoteLibs () {
  const resourceLibs = await fetchResourceLibs()
  loadIconLibs(fetchIconLibs)
  offlinePluginList = resourceLibs.filter(lib => lib.type === 3)
  return resourceLibs.filter(lib => lib.type === 1).map(lib => {
    lib.url = lib.url + 'gcp.js'
    return lib
  })
}

async function fetchIconLibs () {
  const resourceLibs = resourceLibList || (await fetchResourceLibs())
  return resourceLibs.filter(lib => lib.type === 2).map(lib => {
    lib.url = lib.url + '.css'
    return lib
  })
}

let resourceLibList
async function fetchResourceLibs () {
  const metaJson = await fetchAppletMetaData()
  const libNameList = getLibNameList(metaJson)
  resourceLibList = await fetchAppletResourceLibs(libNameList)
  return resourceLibList
}

async function fetchAppletResourceLibs (libNameList) {
  return resourcePool.map(item => {
    const { code, baseUrl, type, ...others } = item
    const url = type !== 3 ? prependResourceLibUrl(baseUrl, code) : baseUrl
    return {
      ...others, 
      name: code,
      url,
      type
    }
  })
}

function prependResourceLibUrl (url, libName) {
  return transformBaseUrlEnv(url)
}

function getLibNameList (metaJson) {
  const { frameworkLib, widgetLibs, iconLibs, plugins } = metaJson.spec.config
  const offlinePluginCodeList = Array.isArray(plugins)
    ? plugins.reduce((pre, cur) => {
      const { isOnline, resourcePoolCode } = cur
      if (!isOnline && resourcePoolCode && !pre.includes(resourcePoolCode)) {
        pre.push(resourcePoolCode)
      }
      return pre
    }, [])
    : []
  
  const libNames = []
  if (frameworkLib.name) {
    const frameworkLibName = frameworkLib.templateVersion
      ? `${frameworkLib.templateVersion}##${frameworkLib.name}`
      : frameworkLib.name
    libNames.push(frameworkLibName)
    if (clientType === 'mobile') {
      if (frameworkLib.name !== 'GCPMobileFramework') {
        libNames.push('GCPMobileFramework')
      }
    } else {
      if (frameworkLib.name !== 'GCPWebFramework') {
        libNames.push('GCPWebFramework')
      }
    }
  }

  const dependencyLibNames = frameworkLib?.dependencyLibNames || []
  dependencyLibNames.forEach((libName, index) => {
    const dependencyTemplateVersions = frameworkLib?.dependencyTemplateVersions || []
    const _libName = dependencyTemplateVersions[index] ? `${dependencyTemplateVersions[index]}##libName` : libName
    libNames.push(_libName)
  })

  if (widgetLibs?.length) {
    const widgetLibNames = widgetLibs.map(item => (item.version ? item.version + '##' + item.name : item.name))
    libNames.push(...widgetLibNames)
  }

  if (iconLibs?.length) {
    const iconLibNames = iconLibs.map(item => item.name).filter(Boolean)
    libNames.push(...iconLibNames)
  }
  libNames.push(...offlinePluginCodeList)
  return libNames
}

let appletMetaJson
async function fetchAppletMetaData () {
  appletMetaJson = applet
  return appletMetaJson
}

const fetchRemoteLibsFactory = params => {
  clientType = params.clientType
  return fetchRemoteLibs
}

export { loadPage, fetchRemoteLibsFactory }
