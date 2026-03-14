<template>
  <view
    class="event-card"
    :class="{ 'event-card--grid': mode === 'grid' }"
    @click="handleClick"
  >
    <image
      class="event-card__image"
      :src="imageUrl"
      mode="aspectFill"
      lazy-load
    />
    <view class="event-card__content">
      <text class="event-card__name">{{ event.name }}</text>
      <view class="event-card__info">
        <view class="event-card__date-row">
          <text class="event-card__icon">📅</text>
          <text class="event-card__date">{{ dateText }}</text>
        </view>
        <view v-if="venue" class="event-card__venue-row">
          <text class="event-card__icon">📍</text>
          <text class="event-card__venue">{{ venue }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import {
  formatEventDateTime,
  getEventImage,
  getVenueName,
  getVenueLocation,
} from '@/utils/index'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: 'list',
  },
})

const emit = defineEmits(['click'])

const imageUrl = computed(() => {
  return getEventImage(props.event.images)
})

const dateText = computed(() => {
  const dates = props.event.dates
  if (!dates?.start) return '日期待定'
  return formatEventDateTime(
    dates.start.localDate,
    dates.start.localTime
  )
})

const venue = computed(() => {
  const name = getVenueName(props.event._embedded)
  const location = getVenueLocation(props.event._embedded)
  return [name, location].filter(Boolean).join(' · ')
})

const handleClick = () => {
  emit('click', props.event)
}
</script>

<style scoped>
/* 列表模式 */
.event-card {
  display: flex;
  flex-direction: row;
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 24rpx;
}

.event-card__image {
  width: 240rpx;
  height: 180rpx;
  flex-shrink: 0;
}

.event-card__content {
  flex: 1;
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.event-card__name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-card__info {
  margin-top: 12rpx;
}

.event-card__date-row,
.event-card__venue-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 6rpx;
}

.event-card__icon {
  font-size: 24rpx;
  margin-right: 8rpx;
}

.event-card__date,
.event-card__venue {
  font-size: 22rpx;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 网格模式 */
.event-card--grid {
  flex-direction: column;
  width: 100%;
}

.event-card--grid .event-card__image {
  width: 100%;
  height: 260rpx;
}

.event-card--grid .event-card__content {
  padding: 16rpx 20rpx 20rpx;
}

.event-card--grid .event-card__name {
  font-size: 26rpx;
}
</style>
