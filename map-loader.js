import { AMAP_KEY } from 'src/common/Enum'
import buildURL from 'axios/lib/helpers/buildURL'



let loaderPromise = null

function loadPlugin(plugin) {
  return new Promise((resolve, reject) => {
    if (!window.AMap) {
      reject(new Error('插件加载失败，AMap尚未初始化'))
    }
    if (!plugin || !plugin.length) {
      resolve()
    } else {
      window.AMap.plugin(plugin, () => {
        resolve()
      })
    }
  })
}

function AMapLoader(plugin = ['AMap.Geocoder', 'AMap.Geolocation']) {
  if (!loaderPromise) {
    loaderPromise = new Promise((resolve, reject) => {
      if (window.AMap) {
        // 地图已加载，尝试加载插件
        loadPlugin(plugin).then(() => {
          resolve(window.AMap)
        })
      } else {
        // 初始化远程脚本
        const url = 'https://webapi.amap.com/maps'
        const params = {
          v: '1.4.15',
          key: AMAP_KEY,
          plugin: plugin.join(),
          callback: '_initAMap'
        }
        const script = document.createElement('script')
        // script.type = 'text/javascript'
        // script.async = true
        script.src = buildURL(url, params)
        script.onerror = e => {
          loaderPromise = null
          reject(e)
        }
        window._initAMap = () => {
          window.document.body.removeChild(script)
          window._initAMap = null
          resolve(window.AMap)
        }
        window.document.body.appendChild(script)
        // 超时处理
        setTimeout(() => {
          loaderPromise = null
          reject(new Error('初始化AMap超时'))
        }, 10000)
      }
    })
  }
  return loaderPromise
}

export default AMapLoader
