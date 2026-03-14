/**
 * 格式化活动日期时间
 * @param {string} dateStr - ISO 日期字符串，如 "2024-12-25"
 * @param {string} timeStr - 时间字符串，如 "19:00:00"
 * @returns {string} 格式化后的日期时间
 */
export const formatEventDateTime = (dateStr, timeStr) => {
  if (!dateStr) return '日期待定'
  const date = new Date(dateStr)
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  const formatted = date.toLocaleDateString('en-US', options)
  if (!timeStr) return formatted
  // 取时分
  const [hours, minutes] = timeStr.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${formatted} · ${h12}:${minutes} ${ampm}`
}

/**
 * 获取活动第一张图片 URL
 * @param {Array} images - Ticketmaster 返回的 images 数组
 * @param {string} ratio - 图片宽高比，默认 '16_9'
 * @returns {string} 图片 URL
 */
export const getEventImage = (images, ratio = '16_9') => {
  if (!images || images.length === 0) return ''
  // 优先选指定比例的图片
  const matched = images.find(
    (img) => img.ratio === ratio && img.width > 300
  )
  return matched ? matched.url : images[0].url
}

/**
 * 获取活动场馆名称
 * @param {Object} embedded - _embedded 对象
 * @returns {string} 场馆名称
 */
export const getVenueName = (embedded) => {
  if (!embedded?.venues?.length) return ''
  return embedded.venues[0].name || ''
}

/**
 * 获取活动城市信息
 * @param {Object} embedded - _embedded 对象
 * @returns {string} "城市, 州/国家"
 */
export const getVenueLocation = (embedded) => {
  if (!embedded?.venues?.length) return ''
  const venue = embedded.venues[0]
  const city = venue.city?.name || ''
  const state = venue.state?.stateCode || venue.country?.name || ''
  return [city, state].filter(Boolean).join(', ')
}