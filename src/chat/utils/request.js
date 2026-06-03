import axios from 'axios'
import store from '@/store'
import { getToken, baseUrl, getAddress } from '@/chat/config'
import { Toast } from 'vant';
import { getHeaderLang } from '@/locale'

function logout(){
    store.dispatch('app/logout')
}

const service = axios.create({
    baseURL: baseUrl,
    timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 如果是上传请求，不设置 Content-Type
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = "application/json; charset=UTF-8"
            config.timeout = 60000
        }
        config.headers['Authorization'] = `Bearer ${getToken()}`

        const address = getAddress()
        if(address)config.headers['Address'] = address

        config.headers['Lang'] = getHeaderLang()
        return config
    },
    error => {
        // 请求失败
        console.log(error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        const code = error.status
        if (code == 401) {
            logout()
            return Promise.reject(new Error(error.response.data || 'Error'))
        } else {
            if (error.response.data) {
                Toast(error.response.data)
            }
            return Promise.reject(new Error(error.response.data || 'Error'))
        }
    }
)

const get = (url, params) => service({ url, method: 'get', params })
const post = (url, data) => service({ url, method: 'post', data })
const del = (url, data) => service({ url, method: 'delete', data })
const put = (url, data) => service({ url, method: 'put', data })

// 上传单张图片
const upload = (url='/api/uploads', filename='upload') => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        
        input.onchange = async (e) => {
            const file = e.target.files[0]
            if (!file) {
                input.remove() // 删除 input 元素
                reject(new Error('未选择文件'))
                return
            }
            
            const formData = new FormData()
            formData.set(filename, file, file.name)
            
            try {
                Toast.loading({
                    message: '',
                    forbidClick: true,
                });
                const response = await service({
                    url,
                    method: 'post',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                Toast.clear()
                input.remove() // 删除 input 元素
                resolve(response)
            } catch (error) {
                input.remove() // 删除 input 元素
                Toast.clear()
                reject(error)
            }
        }
        
        input.click()
    })
}

// 上传文件（支持图片、视频、音频）
const uploadFile = (url, options = {}) => {
    const {
        filename = 'file', // 文件名参数
        accept = 'image/*', // 文件类型
        extraParams = {}, // 额外参数
    } = options

    return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = accept
        
        input.onchange = async (e) => {
            const file = e.target.files[0]
            if (!file) {
                input.remove()
                reject(new Error('未选择文件'))
                return
            }
            
            const formData = new FormData()
            formData.set(filename, file, file.name)
            
            // 添加额外参数
            Object.keys(extraParams).forEach(key => {
                formData.append(key, extraParams[key])
            })
            
            try {
                let loadingToast = Toast.loading({
                    message: '上传中... 0%',
                    forbidClick: true,
                    duration: 0
                })
                
                const response = await service({
                    url,
                    method: 'post',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                        loadingToast.message = `上传中... ${percentCompleted}%`
                    }
                })
                
                Toast.clear()
                input.remove()
                resolve(response)
            } catch (error) {
                input.remove()
                Toast.clear()
                reject(error)
            }
        }
        
        input.click()
    })
}

export default {
    get,
    post,
    del,
    put,
    upload,
    uploadFile
}