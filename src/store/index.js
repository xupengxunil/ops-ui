import { createStore } from 'vuex'
import { getinfo, login } from '../api/user'
import { setToken, removeToken } from '../composables/auth'

const store = createStore({
    state() {
        return {
            //用户信息
            user: {},

            //侧边宽度
            asideWidth: "250px",

            menus: []
        }
    },
    mutations: {
        //记录用户信息
        SET_USERINFO(state, user) {
            state.user = user
        },

        //展开/折叠
        handleAsideWidth(state) {
            state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px"
        },

        SET_MENUS(state, menus) {
            state.menus = menus
        }
    },
    actions: {
        //登录

        login({ commit }, { username, password, ldap }) {
            return new Promise((resolve, reject) => {
                login(username, password, ldap).then(res => {
                    setToken(res.data.data.token)
                    resolve(res)
                }).catch((err) => {
                    console.log(err)
                    reject(err.name)
                }
                )
            })
        },

        //获取当前用户信息
        getinfo({ commit }) {
            return new Promise((resolve, reject) => {
                getinfo().then(res => {
                    commit("SET_USERINFO", res.data.user)
                    commit("SET_MENUS", res.data.menu)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },

        //退出登录
        logout({ commit }) {
            //移除token
            removeToken()
            //清除当前用户的vuex
            commit("SET_USERINFO", {})
        }

    }
})


export default store