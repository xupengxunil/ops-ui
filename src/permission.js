import router from "./router"
import store from "./store"
import { getToken } from "./composables/auth"
import { notifyMessage,
    showFullLoading,
    hideFullLoading
 } from "./composables/util"

//全局前置守卫
router.beforeEach(async (to, from, next) => {

    showFullLoading()
    const token = getToken()

    //没有登录，强制跳转到登录页

    if (!token && to.path != "/login") {
        notifyMessage("请先登录", "error")
        return next({ path: "/login" })
    }

    if (token == 'undefined' ) {
        store.dispatch("logout")
        notifyMessage("请先登录", "error")
        return next({ path: "/login" })
    }

    //防止重复登录
    if (token && to.path == "/login") {
        notifyMessage("请勿重复登录", "error")
        console.log(from.path)
        return next({ path: from.path ? from.path : "/" })
    }

    //如果用户登录了，自动获取用户信息，并存储在vuex中

    if(token){
        await store.dispatch("getinfo")
    }

    let title = to.meta.title ? to.meta.title: ""

    console.log(to)

    document.title = title

    next()

})

//全局后置守卫
router.afterEach((to,from)=>hideFullLoading())