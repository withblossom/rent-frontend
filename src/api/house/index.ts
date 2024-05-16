import request from '@/utils/request'
import { type resultInter } from '@/api/type'

export const addHouse = (data) => request.post<any, resultInter>('/house', data)

export const getHousesPage = (pageNum, pageSize, housenameLike, houseState) =>
  request.get<any, resultInter>(`/house/${pageNum}/${pageSize}/`, {
    params: {
      housenameLike,
      houseState
    }
  })

export const updateHouse = (data) => request.put<any, resultInter>('/house/' + data.id, data)

export const deleteHouse = (id) => request.delete<any, resultInter>('/house/' + id)

export const getHouse = (id) => request.get<any, resultInter>('/house/' + id)

export const allHousesForSelect = () => request.get<any, resultInter>('/house/select')

export const getHouseInfo = (id) => request.get<any, resultInter>('/house/info/' + id)

export const admitHouseProfile = (id, data) =>
  request.post<any, resultInter>('/house/profile/' + id, data)

export const admitHouseLabel = (id, data) =>
  request.post<any, resultInter>('/house/label/' + id, null, { params: { label: data } })

export const deleteHouseLabel = (id, data) =>
  request.delete<any, resultInter>('/house/label/' + id, { params: { label: data } })
