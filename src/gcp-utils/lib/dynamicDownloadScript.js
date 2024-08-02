import { transformBaseUrlEnv } from './resource-libs'

const dynamicDownloadScript = async urlArr => {
  if (urlArr?.length) {
    urlArr = urlArr.filter((item, index) => urlArr.indexOf(item) === index)
    const promiseArr = []
    urlArr.forEach(url => {
      promiseArr.push(new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        // 处理加载的js地址不正确，导致的报错
        script.onload = resolve
        script.onerror = reject
        script.src = transformBaseUrlEnv(url)
        if (document.head.appendChild) {
          document.head.appendChild(script)
        } else {
          document.getElementsByTagName('head')[0].appendChild(script)
        }
      }))
    })
    return await Promise.allSettled(promiseArr)
  }
}

export default dynamicDownloadScript
