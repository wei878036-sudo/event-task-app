<template>
  <view class="page">
    <view class="search-bar">
      <uni-search-bar
        v-model="searchVal"
        placeholder="搜索活动..."
        cancel-button="none"
        clear-button="auto"
        bg-color="#f3f4f6"
        @confirm="handleSearch"
        @clear="handleClear"
      />
      <view class="view-toggle" @click="eventStore.toggleViewMode()">
        <text class="toggle-icon">
          {{ eventStore.viewMode === 'list' ? '▦' : '☰' }}
        </text>
      </view>
    </view>

    <view
      v-if="eventStore.loading && eventStore.eventList.length === 0"
      class="status-wrap"
    >
      <uni-load-more status="loading" :content-text="loadText" />
    </view>

    <view
      v-else-if="!eventStore.loading && eventStore.eventList.length === 0"
      class="status-wrap"
    >
      <image class="status-icon" src="/static/icon/empty.svg" mode="aspectFit" />
      <text class="status-text">暂无活动</text>
      <view class="retry-btn" @click="loadInitial">
        <text class="retry-text">重试</text>
      </view>
    </view>

    <!-- 列表视图 -->
    <scroll-view
      v-else
      class="event-scroll"
      scroll-y
      :lower-threshold="100"
      @scrolltolower="handleLoadMore"
    >
      <view v-if="eventStore.viewMode === 'list'" class="event-list">
        <EventCard
          v-for="item in eventStore.eventList"
          :key="item.id"
          :event="item"
          mode="list"
          @click="goDetail"
        />
      </view>

      <!-- 网格模式 -->
      <view v-else class="event-grid">
        <view
          v-for="item in eventStore.eventList"
          :key="item.id"
          class="grid-item"
        >
          <EventCard :event="item" mode="grid" @click="goDetail" />
        </view>
      </view>

      <view class="load-more-wrap">
        <uni-load-more
          v-if="eventStore.loading"
          status="loading"
          :content-text="loadText"
        />
        <uni-load-more
          v-else-if="!eventStore.hasMore"
          status="noMore"
          :content-text="loadText"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEventStore } from '@/store/event'
import EventCard from '@/components/EventCard.vue'

const eventStore = useEventStore()
const searchVal = ref('')

// uni-load-more 组件文案配置
const loadText = {
  contentdown: '上拉加载更多',
  contentrefresh: '加载中...',
  contentnomore: '没有更多活动了',
}

// 首次加载
const loadInitial = () => {
  eventStore.fetchEvents()
}

// 搜索
const handleSearch = (res) => {
  const keyword = res.value || searchVal.value
  eventStore.setKeyword(keyword)
  eventStore.fetchEvents()
}

const handleClear = () => {
  searchVal.value = ''
  eventStore.setKeyword('')
  eventStore.fetchEvents()
}

const handleLoadMore = () => {
  eventStore.loadMore()
}

const goDetail = (event) => {
  uni.navigateTo({
    url: `/pages/event-detail/index?id=${event.id}`,
  })
}

onMounted(() => {
  loadInitial()
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f3f4f6;
  box-sizing: border-box;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.search-bar :deep(.uni-searchbar) {
  flex: 1;
  padding: 10rpx 0;
}

.view-toggle {
  margin-left: 20rpx;
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 36rpx;
}

.toggle-icon {
  font-size: 36rpx;
  color: #374151;
}

/* 状态区 */
.status-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.status-icon {
  width: 160rpx;
  height: 160rpx;
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

/* 滚动区域 */
.event-scroll {
  flex: 1;
  overflow: hidden;
}

/* 列表 */
.event-list {
  padding: 24rpx;
}

/* 网格 */
.event-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 24rpx 12rpx;
}

.grid-item {
  width: 50%;
  box-sizing: border-box;
  padding: 0 12rpx;
  margin-bottom: 0;
}

/* 加载更多 */
.load-more-wrap {
  padding: 32rpx 0;
  text-align: center;
}

.load-more-text {
  font-size: 24rpx;
  color: #9ca3af;
}
</style>
