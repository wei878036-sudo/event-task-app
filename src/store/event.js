import { defineStore } from 'pinia'
import { searchEvents, getEventDetail } from '@/api/event'

export const useEventStore = defineStore('event', {
  state: () => ({
    eventList: [],
    currentPage: 0,
    pageSize: 20,
    totalPages: 0,// 总页数
    totalElements: 0,// 总条数
    hasMore: true,
    loading: false,
    keyword: '',
    currentEvent: null,
    detailLoading: false,
    viewMode: 'list',
  }),

  actions: {
    // 获取活动列表
    async fetchEvents(params = {}) {
      this.loading = true
      this.currentPage = 0
      try {
        const res = await searchEvents({
          size: this.pageSize,
          page: 0,
          keyword: this.keyword || null,
          ...params,
        })
        const embedded = res._embedded || {}
        this.eventList = embedded.events || []
        const pageInfo = res.page || {}
        this.totalPages = pageInfo.totalPages || 0
        this.totalElements = pageInfo.totalElements || 0
        this.hasMore = this.currentPage + 1 < this.totalPages
      } catch (err) {
        console.error('获取活动列表失败:', err)
        this.eventList = []
      } finally {
        this.loading = false
      }
    },

    // 加载更多
    async loadMore() {
      if (!this.hasMore || this.loading) return
      this.loading = true
      this.currentPage++
      try {
        const res = await searchEvents({
          size: this.pageSize,
          page: this.currentPage,
          keyword: this.keyword || undefined,
        })
        const embedded = res._embedded || {}
        const newEvents = embedded.events || []
        this.eventList = [...this.eventList, ...newEvents]
        const pageInfo = res.page || {}
        this.totalPages = pageInfo.totalPages || 0
        this.hasMore = this.currentPage + 1 < this.totalPages
      } catch (err) {
        console.error('加载更多活动失败:', err)
        this.currentPage--
      } finally {
        this.loading = false
      }
    },

      // 活动详情
    async fetchEventDetail(id) {
      this.detailLoading = true
      this.currentEvent = null
      try {
        const res = await getEventDetail(id)
        this.currentEvent = res
      } catch (err) {
        console.error('获取活动详情失败:', err)
      } finally {
        this.detailLoading = false
      }
    },

    toggleViewMode() {
      this.viewMode = this.viewMode === 'list' ? 'grid' : 'list'
    },

    setKeyword(keyword) {
      this.keyword = keyword
    },
  },
})
