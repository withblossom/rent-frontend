import request from '@/utils/request'
import { type resultInter } from '@/api/type'

export const register = (data) => request.post<any, resultInter>('/user/register', data)

export const login = (data) => request.post<any, resultInter>('/user/login', data)

export const logout = () => request.post<any, resultInter>('/user/logout')

export const getUserSelf = () => request.get<any, resultInter>('/user/self')

export const usersByPage = (pageNum, pageSize, usernameLike, phoneNumberLike) =>
  request.get<any, resultInter>(`/user/${pageNum}/${pageSize}/`, {
    params: { usernameLike, phoneNumberLike }
  })
export const updateUser = (data) => request.put<any, resultInter>('/user/' + data.id, data)

export const deleteUser = (id) => request.delete<any, resultInter>('/user/' + id)

export const getUserInfo = (id) => request.get<any, resultInter>('/user/info/' + id)

export const allUsersForSelect = () => request.get<any, resultInter>('/user/select')

export const admitUserProfile = (id, data) =>
  request.post<any, resultInter>('/user/profile/' + id, data)

export const admitUserLabel = (id, data) =>
  request.post<any, resultInter>('/user/label/' + id, null, { params: { label: data } })

export const deleteUserLabel = (id, data) =>
  request.delete<any, resultInter>('/user/label/' + id, { params: { label: data } })
