/*
 * @Description: 
 * @Version: 1.0
 * @Author: JCY
 * @Date: 2025-04-26 09:15:07
 */
// 接口地址
export const baseUrl = process.env.VUE_APP_BASE_URL

// 部署目录
export const publicPath = '/chat/'

export const mainColor = '#FFE5A5'

export const boxColor = '#221F17'

// 取Token
export const getToken = () => localStorage.getItem('Token')

export const socketUrl = `${process.env.NODE_ENV=="development"?'ws':'wss'}://${process.env.VUE_APP_SOCKET_URL || location.hostname}/wss/default.io?token=`

// 存取用户ID
const userIdKey = 'UserId'
export const getUserId = () => localStorage.getItem(userIdKey)
export const setUserId = data => localStorage.setItem(userIdKey, data)

// 取钱包地址
export const getAddress = () => localStorage.getItem('Address')

// 取多语言
export const getLang = () => localStorage.getItem('Lang') || 'en'