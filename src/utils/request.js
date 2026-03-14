
const DEFAULT_REMOTE_BASE_URL =
  'https://app.ticketmaster.com/discovery/v2'

const resolveBaseUrl = () => {
  const envBaseUrl = import.meta.env.VITE_TMS_BASE_URL || ''

  // #ifdef H5
  return envBaseUrl || DEFAULT_REMOTE_BASE_URL
  // #endif

  // #ifndef H5
  if (
    envBaseUrl.startsWith('http://') ||
    envBaseUrl.startsWith('https://')
  ) {
    return envBaseUrl
  }
  return DEFAULT_REMOTE_BASE_URL
  // #endif
}

const BASE_URL = resolveBaseUrl()

// base64解码
const decodeApiKey = () => {
  const encoded = import.meta.env.VITE_TMS_API_KEY_ENCODED || ''
  if (!encoded) return ''
  try {
    return decodeURIComponent(
      atob(encoded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch {
    return ''
  }
}

class Request {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || ''
    this.timeout = options.timeout || 15000
    this.header = options.header || {}
  }

  buildUrl(options) {
    const params = { ...options.data, apikey: decodeApiKey() }
    const queryString = Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=` +
          `${encodeURIComponent(params[key])}`
      )
      .join('&')

    const requestUrl = (options.baseUrl || this.baseUrl) + options.url
    return queryString ? `${requestUrl}?${queryString}` : requestUrl
  }

  
  request(options = {}) {
    const url = this.buildUrl(options)

    // #ifdef H5
    return fetch(url)
      .then((res) => {
        if (res.ok) return res.json()
        uni.showToast({ title: `请求失败 (${res.status})`, icon: 'none' })
        return Promise.reject(res)
      })
      .catch((err) => {
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        return Promise.reject(err)
      })
    // #endif

    // #ifndef H5
    return new Promise((resolve, reject) => {
      uni.request({
        url,
        method: options.method || 'GET',
        header: { ...this.header, ...options.header },
        timeout: options.timeout || this.timeout,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            uni.showToast({
              title: `请求失败 (${res.statusCode})`,
              icon: 'none',
            })
            reject(res)
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '网络请求失败',
            icon: 'none',
          })
          reject(err)
        },
      })
    })
    // #endif
  }

  get(url, data = {}, options = {}) {
    return this.request({ url, method: 'GET', data, ...options })
  }
}

const request = new Request({
  baseUrl: BASE_URL,
  timeout: 15000,
})

export default request
