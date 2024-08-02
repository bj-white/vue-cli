function transformBaseUrlEnv (str) {
  if (str.trim()) {
    // 有库地址请求接口
    const urlReg = /\$\{(\w+)\}/g // 匹配${}
    if (str.match(urlReg)) {
      // 目前只考虑有一个环境变量的情况
      const regStr = str.match(urlReg)[0]
      const envName = regStr.replace(urlReg, '$1') // 获取环境变量名称
      if (envName === 'GCP_CDN_BASE_URL') {
        const completeUrl = str.replace(urlReg, 'https://cdn.developer.glodon.com')
        str = completeUrl
      }
    }
  }
  return str
}

const loadIconLibs = async (fetchIconLibs) => {
  const iconLibs = await fetchIconLibs()
  if (iconLibs.length) {
    iconLibs.forEach((lib, index) => {
      downloadCSS(lib.url, index)
    })
  }
}

function downloadCSS(url, index) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('name', 'iconfontLink' + index)
  link.setAttribute('href', url)
  document.documentElement.appendChild(link)
}

export { transformBaseUrlEnv, loadIconLibs }
