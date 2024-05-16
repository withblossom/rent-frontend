import { defineStore } from 'pinia'
import router from '@/router'

const useHouseStore = defineStore('house', {
  state() {
    return {}
  },
  actions: {
    toHouseInfoPage(id) {
      router.push({ name: 'houseInfo', query: { houseId: id } })
    }
  }
})
export default useHouseStore
