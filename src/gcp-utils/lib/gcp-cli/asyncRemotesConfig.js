const GcpCliAsyncRemotesConfig = {
  _remotesLibs: [],
  _proxyMap: {},
  async init (fetchRemoteLibs) {
    this._remotesLibs = await fetchRemoteLibs()
    return await this._loadRemoteLibs()
  },
  async _loadRemoteLibs () {
    return await this._fetchMFProxy()
  },
  async _fetchMFProxy () {
    const promiseLibs = this._remotesLibs.map(lib => {
      return new Promise(resolve => {
        const script = document.createElement('script')
        script.src = lib.url
        script.onload = () => {
          resolve(lib.name)
        }
        document.head.appendChild(script)
      })
    })

    if (!promiseLibs.length) {
      throw new Error('没有可用的远程库，请检查是否已在平台注册？')
    }

    const libNames = await Promise.all(promiseLibs)

    const proxy = {
      get: request => {
        // 这里认为request都是以./开头
        const noPrefix = request.substring(2) // 去掉./
        const libName = noPrefix.substring(0, noPrefix.indexOf('/'))
        const moduleFilename = '.' + noPrefix.substring(noPrefix.indexOf('/'))
        return window[libName].get(moduleFilename)
      },
      init: async arg => {
        try {
          for (const libName of libNames) {
            const init = window[libName].init
            this._proxyMap[libName] = {
              init
            }
            await init(arg)
          }
        } catch (e) {
          console.log('remote container already initialized', e)
        }
      }
    }
    return proxy
  }
}

export default GcpCliAsyncRemotesConfig
