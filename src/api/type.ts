export interface userInter {
  id?: number
  username: string
  age: number
  sex: boolean
  phoneNumber: string
  password: string
  avatar: string
}

export interface loginformInter {
  phoneNumber: string
  password: string
}

export interface resultInter {
  success: boolean
  errorMsg: string
  data: any
  total: number
}
