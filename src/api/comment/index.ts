import request from '@/utils/request'
import { type resultInter } from '@/api/type'

export const commentsByHouseId = (id) => request.get<any, resultInter>('/comment/house/' + id)

export const commentsByUserId = (id) => request.get<any, resultInter>('/comment/user/' + id)

export const deleteComment = (id) => request.delete<any, resultInter>('/comment/' + id)

export const updateComment = (id, comment) =>
  request.put<any, resultInter>('/comment/' + id, comment)
