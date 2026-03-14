<template>
  <view class="page">
    <view v-if="eventStore.detailLoading" class="status-wrap">
      <uni-load-more status="loading" />
    </view>

    <view v-else-if="event" class="detail-scroll">
      <image
        class="detail-hero"
        :src="heroImage"
        mode="aspectFill"
      />

      <view class="detail-body">
        <text class="detail-name">{{ event.name }}</text>

        <view class="info-row">
          <uni-icons
            class="info-icon"
            type="calendar-filled"
            size="20"
            color="#2563eb"
          />
          <view class="info-content">
            <text class="info-label">日期与时间</text>
            <text class="info-value">{{ dateText }}</text>
          </view>
        </view>

        <view v-if="venueName" class="info-row">
          <uni-icons
            class="info-icon"
            type="location-filled"
            size="20"
            color="#2563eb"
          />
          <view class="info-content">
            <text class="info-label">场馆</text>
            <text class="info-value">{{ venueName }}</text>
            <text v-if="venueLocation" class="info-sub">
              {{ venueLocation }}
            </text>
          </view>
        </view>
        <view v-if="priceRange" class="info-row">
          <uni-icons
            class="info-icon"
            type="wallet-filled"
            size="20"
            color="#2563eb"
          />
          <view class="info-content">
            <text class="info-label">票价</text>
            <text class="info-value">{{ priceRange }}</text>
          </view>
        </view>

        <view v-if="saleStatus" class="info-row">
          <uni-icons
            class="info-icon"
            type="shop-filled"
            size="20"
            color="#2563eb"
          />
          <view class="info-content">
            <text class="info-label">售票状态</text>
            <view class="status-badge" :class="statusClass">
              <text class="status-badge-text">{{ saleStatus }}</text>
            </view>
          </view>
        </view>

        <!-- 分类标签 -->
        <view v-if="classifications.length" class="tag-section">
          <text class="section-title">分类</text>
          <view class="tag-list">
            <view
              v-for="(tag, idx) in classifications"
              :key="idx"
              class="tag-item"
            >
              <text class="tag-text">{{ tag }}</text>
            </view>
          </view>
        </view>

        <view v-if="description" class="desc-section">
          <text class="section-title">简介</text>
          <text class="desc-text">{{ description }}</text>
        </view>

        <view v-if="event.url" class="buy-section">
          <view class="buy-btn" @click="openTicketUrl">
            <uni-icons
              class="buy-btn-icon"
              type="cart-filled"
              size="18"
              color="#ffffff"
            />
            <text class="buy-btn-text">购买门票</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="status-wrap">
      <uni-icons
        class="status-icon"
        type="info-filled"
        size="48"
        color="#9ca3af"
      />
      <text class="status-text">加载活动失败</text>
      <view class="retry-btn" @click="loadDetail">
        <text class="retry-text">重试</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useEventStore } from '@/store/event'
import {
  formatEventDateTime,
  getEventImage,
  getVenueName,
  getVenueLocation,
} from '@/utils/index'

const eventStore = useEventStore()
let eventId = ''

onLoad((query) => {
  eventId = query.id
  loadDetail()
})

const loadDetail = () => {
  if (eventId) {
    eventStore.fetchEventDetail(eventId)
  }
}

const event = computed(() => eventStore.currentEvent)

// 活动头图
const heroImage = computed(() => {
  return getEventImage(event.value?.images, '16_9')
})

const dateText = computed(() => {
  const dates = event.value?.dates
  if (!dates?.start) return '日期待定'
  return formatEventDateTime(
    dates.start.localDate,
    dates.start.localTime
  )
})

const venueName = computed(() => {
  return getVenueName(event.value?._embedded)
})

const venueLocation = computed(() => {
  return getVenueLocation(event.value?._embedded)
})

const priceRange = computed(() => { //票价
  const ranges = event.value?.priceRanges
  if (!ranges?.length) return ''
  const r = ranges[0]
  const currency = r.currency || 'USD'
  if (r.min && r.max && r.min !== r.max) {
    return `${currency} ${r.min} - ${r.max}`
  }
  return `${currency} ${r.min || r.max || ''}`
})

const saleStatus = computed(() => {
  return event.value?.dates?.status?.code || ''
})

const statusClass = computed(() => {
  const code = saleStatus.value
  if (code === 'onsale') return 'status--onsale'
  if (code === 'offsale') return 'status--offsale'
  return 'status--default'
})

const classifications = computed(() => {
  const cls = event.value?.classifications
  if (!cls?.length) return []
  const tags = []
  const first = cls[0]
  if (first.segment?.name) {
    tags.push(first.segment.name)
  }
  if (first.genre?.name) {
    tags.push(first.genre.name)
  }
  if (first.subGenre?.name) {
    tags.push(first.subGenre.name)
  }
  return tags
})

const description = computed(() => {
  return (
    event.value?.info ||
    event.value?.pleaseNote ||
    ''
  )
})

const openTicketUrl = () => {
  const url = event.value?.url
  if (!url) return
  // #ifdef H5
  window.open(url, '_blank')
  // #endif
  // #ifndef H5
  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({
        title: '购票链接已复制',
        icon: 'success',
      })
    },
  })
  // #endif
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f3f4f6;
}

.detail-scroll {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头图 */
.detail-hero {
  width: 100%;
  height: 440rpx;
}

/* 内容区域 */
.detail-body {
  flex: 1;
  min-height: calc(100vh - 400rpx);
  box-sizing: border-box;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 32rpx 32rpx 0 0;
  margin-top: -40rpx;
  position: relative;
}

.detail-name {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 32rpx;
}

/* 信息行 */
.info-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f3f4f6;
}

.info-icon {
  width: 40rpx;
  margin-right: 20rpx;
  margin-top: 4rpx;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  display: block;
  font-size: 22rpx;
  color: #9ca3af;
  margin-bottom: 4rpx;
  text-transform: uppercase;
  letter-spacing: 1rpx;
}

.info-value {
  display: block;
  font-size: 28rpx;
  color: #1f2937;
  font-weight: 500;
}

.info-sub {
  display: block;
  font-size: 24rpx;
  color: #6b7280;
  margin-top: 4rpx;
}

/* 状态徽章 */
.status-badge {
  display: inline-flex;
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
  margin-top: 4rpx;
}

.status--onsale {
  background: #d1fae5;
}
.status--onsale .status-badge-text {
  color: #065f46;
}

.status--offsale {
  background: #fee2e2;
}
.status--offsale .status-badge-text {
  color: #991b1b;
}

.status--default {
  background: #f3f4f6;
}
.status--default .status-badge-text {
  color: #6b7280;
}

.status-badge-text {
  font-size: 24rpx;
  font-weight: 500;
  text-transform: capitalize;
}

/* 分类标签 */
.tag-section {
  margin-top: 32rpx;
}

.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16rpx;
}

.tag-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag-item {
  padding: 8rpx 24rpx;
  background: #eff6ff;
  border-radius: 24rpx;
}

.tag-text {
  font-size: 24rpx;
  color: #2563eb;
}

/* 描述区域 */
.desc-section {
  margin-top: 32rpx;
}

.desc-text {
  font-size: 28rpx;
  color: #4b5563;
  line-height: 1.7;
}

/* 购票按钮 */
.buy-section {
  margin-top: 40rpx;
  padding-bottom: 60rpx;
}

.buy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 48rpx;
  box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.3);
}

.buy-btn-icon {
  flex-shrink: 0;
}

.buy-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

/* 状态区 */
.status-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.status-icon {
  margin-bottom: 24rpx;
}

.status-text {
  font-size: 30rpx;
  color: #9ca3af;
}

.retry-btn {
  margin-top: 32rpx;
  padding: 16rpx 48rpx;
  background: #3b82f6;
  border-radius: 40rpx;
}

.retry-text {
  font-size: 28rpx;
  color: #ffffff;
}
</style>
