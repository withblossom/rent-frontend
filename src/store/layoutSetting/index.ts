import { clearBrowserCache, clearcaffeineCache, clearRedisCache } from '@/api/system'
import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('layoutSettingStore', {
  state: () => {
    return {
      fold: false,
      refresh_flag: false,
      settingPage: false
    }
  },
  actions: {
    closeSettingPage() {
      this.settingPage = false
    },
    openSettingPage() {
      this.settingPage = true
    },
    refresh() {
      this.refresh_flag = !this.refresh_flag
    },
    async removeBrowserCache() {
      await clearBrowserCache()
      this.refresh()
    },
    async removeCaffeineCache() {
      await clearcaffeineCache()
      this.refresh()
    },
    async removeRedisCache() {
      await clearRedisCache()
      this.refresh()
    }
  }
})

export default useLayoutSettingStore
