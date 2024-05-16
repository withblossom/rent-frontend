import request from '@/utils/request'

export const clearBrowserCache = () => request.delete<any, void>('/system/browser-cache')

export const clearcaffeineCache = () => request.delete<any, void>('/system/local-cache')

export const clearRedisCache = () => request.delete<any, void>('/system/redis-cache')
