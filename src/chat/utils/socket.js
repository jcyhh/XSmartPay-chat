class Socket {
    constructor(url, options = {}) {
        this.url = url
        this.options = {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            heartbeatInterval: 5000,
            ...options
        }
        this.socket = null
        this.isConnected = false
        this.reconnectTimer = null
        this.heartbeatTimer = null
        this.listeners = new Map()
        this.reconnectAttempts = 0
    }

    // 初始化连接
    connect() {
        if (this.socket) {
            this.disconnect()
        }

        try {
            this.socket = new WebSocket(this.url)
            
            // 连接成功
            this.socket.onopen = () => {
                console.log('WebSocket connected')
                this.isConnected = true
                this.reconnectAttempts = 0
                this.triggerEvent('connect')
            }

            // 连接断开
            this.socket.onclose = (event) => {
                console.log('WebSocket disconnected:', event)
                this.isConnected = false
                this.stopHeartbeat()
                this.triggerEvent('disconnect', event)
                
                // 只有在非主动断开的情况下才尝试重连
                if (event.code !== 4000 && this.options.reconnection && this.reconnectAttempts < this.options.reconnectionAttempts) {
                    this.reconnectAttempts++
                    const delay = Math.min(
                        this.options.reconnectionDelay * Math.pow(2, this.reconnectAttempts - 1),
                        this.options.reconnectionDelayMax
                    )
                    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)
                    this.reconnectTimer = setTimeout(() => this.connect(), delay)
                    this.triggerEvent('reconnect_attempt', this.reconnectAttempts)
                } else if (this.reconnectAttempts >= this.options.reconnectionAttempts) {
                    this.triggerEvent('reconnect_failed')
                }
            }

            // 连接错误
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error)
                this.triggerEvent('error', error)
            }

            // 接收消息
            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    // 处理特定事件
                    switch (data.event) {
                        case 'connect':
                            // 使用服务器返回的 ping_interval 设置心跳间隔
                            this.options.heartbeatInterval = data.content.ping_interval * 1000 // 转换为毫秒
                            this.startHeartbeat()
                            break;
                            
                        case 'event_talk':
                            this.triggerEvent('talk', data)
                            break;
                            
                        case 'event_talk_revoke':
                            this.triggerEvent('revoke', data)
                            break;
                            
                        default:
                            // 忽略其他所有事件
                            break;
                    }
                } catch (e) {
                    console.error('Error parsing message:', e)
                }
            }
        } catch (error) {
            console.error('Error creating WebSocket:', error)
            this.triggerEvent('error', error)
        }
    }

    // 断开连接
    disconnect() {
        if (this.socket) {
            // 使用 4000 作为主动断开的代码
            this.socket.close(4000, 'Active disconnect')
            this.socket = null
            this.isConnected = false
            this.stopHeartbeat()
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer)
                this.reconnectTimer = null
            }
        }
    }

    // 发送消息到服务器
    send(data) {
        if (this.socket && this.isConnected) {
            try {
                const message = typeof data === 'object' ? JSON.stringify(data) : data
                this.socket.send(message)
            } catch (error) {
                console.error('Error sending message:', error)
                this.triggerEvent('error', error)
            }
        } else {
            console.warn('WebSocket is not connected')
        }
    }

    // 触发本地事件
    triggerEvent(event, data) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event)
            callbacks.forEach(callback => {
                try {
                    callback(data)
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error)
                }
            })
        }
    }

    // 监听事件
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event).push(callback)
    }

    // 移除事件监听
    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event)
            const index = callbacks.indexOf(callback)
            if (index > -1) {
                callbacks.splice(index, 1)
            }
        }
    }

    // 开始心跳检测
    startHeartbeat() {
        this.stopHeartbeat()
        this.heartbeatTimer = setInterval(() => {
            if (this.isConnected) {
                this.send('{"event":"heartbeat"}')
            }
        }, this.options.heartbeatInterval)
    }

    // 停止心跳检测
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer)
            this.heartbeatTimer = null
        }
    }

    // 获取连接状态
    getConnectionStatus() {
        return this.isConnected
    }
}

export default Socket 