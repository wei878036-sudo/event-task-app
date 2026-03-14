import request from '@/utils/request'

// 活动列表
export const searchEvents = (params = {}) => {
  return request.get('/events.json', {
    size: params.size || 20,
    page: params.page || 0,
    ...params,
  })
}

// 获取活动详情·
export const getEventDetail = (id) => {
  return request.get(`/events/${id}.json`)
}