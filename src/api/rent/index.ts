import request from '@/utils/request'
import { type resultInter } from '@/api/type'

export const rentsPage = (pageNum, pageSize, usernameLike, phoneNumberLike, houseNameLike) =>
  request.get<any, resultInter>(`/rent/${pageNum}/${pageSize}/`, {
    params: {
      usernameLike,
      phoneNumberLike,
      houseNameLike
    }
  })

export const deleteRent = (id) => request.delete<any, resultInter>('/rent/' + id)

export const rent = (data) => request.post<any, resultInter>('/rent/', data)

export const updateRentById = (data) => request.put<any, resultInter>('/rent/' + data.id, data)

export const rentsByHouseId = (id) => request.get<any, resultInter>('/rent/house/' + id)

export const rentsByUserId = (id) => request.get<any, resultInter>('/rent/user/' + id)
