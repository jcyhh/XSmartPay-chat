export default [
    {
        path: '/', // 消息
        component: () => import ('@/chat/views/index.vue')
    },
    {
        path: '/friend/:id', // 单聊
        component: () => import('@/chat/views/chat/friend.vue')
    },
    {
        path: '/group/:id', // 群聊
        component: () => import('@/chat/views/chat/group.vue')
    },
    {
        path: '/friends', // 好友列表
        component: () => import('@/chat/views/friend/index.vue')
    },
    {
        path: '/friendAdd', // 添加好友
        component: () => import('@/chat/views/friend/add.vue')
    },
    {
        path: '/friendAgree/:id', // 审核添加申请
        component: () => import('@/chat/views/friend/agree.vue')
    },
    {
        path: '/friendApply', // 好友申请记录
        component: () => import('@/chat/views/friend/apply.vue')
    },
    {
        path: '/friendHome/:id', // 好友主页
        component: () => import('@/chat/views/friend/home.vue')
    },
    {
        path: '/friendSearch', // 搜索好友
        component: () => import('@/chat/views/friend/search.vue')
    },
    {
        path: '/groups', // 群聊列表
        component: () => import('@/chat/views/group/index.vue')
    },
    {
        path: '/groupsOfficial', // 官方群列表
        component: () => import('@/chat/views/group/official.vue')
    },
    {
        path: '/groupCreate', // 创建群聊
        component: () => import('@/chat/views/group/create.vue')
    },
    {
        path: '/groupDetail/:id', // 群聊详情
        component: () => import('@/chat/views/group/detail.vue')
    },
    {
        path: '/groupMember/:id', // 群成员
        component: () => import('@/chat/views/group/member.vue')
    },
    {
        path: '/groupHome', // 群成员主页
        component: () => import('@/chat/views/group/home.vue')
    },
    {
        path: '/groupSet/:id', // 群设置
        component: () => import('@/chat/views/group/set.vue')
    },
    {
        path: '/groupQrcode/:id', // 群邀请码
        component: () => import('@/chat/views/group/qrcode.vue')
    },
    {
        path: '/groupJoin/:id', // 群邀请码
        component: () => import('@/chat/views/group/join.vue')
    },
    {
        path: '/groupManage/:id', // 群管理列表
        component: () => import('@/chat/views/group/manage.vue')
    },
    {
        path: '/groupInvite/:id', // 群邀请好友
        component: () => import('@/chat/views/group/invite.vue')
    },
    {
        path: '/groupRemoveMember/:id', // 群批量踢成员
        component: () => import('@/chat/views/group/removeMember.vue')
    },
    // {
    //     path: '/giftDetail', // 红包详情
    //     component: () => import('@/chat/views/gift/detail.vue')
    // },
    // {
    //     path: '/giftSend', // 发红包
    //     component: () => import('@/chat/views/gift/send.vue')
    // },
    // {
    //     path: '/giftChoose', // 发红包选择领取人
    //     component: () => import('@/chat/views/gift/choose.vue')
    // },
]