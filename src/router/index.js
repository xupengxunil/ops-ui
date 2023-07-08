import { createRouter, createWebHashHistory } from 'vue-router'

import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'
import SystemMenu from '~/pages/system/menu.vue'
import SystemSettings from '~/pages/system/settings.vue'
import ProjectGroup from '~/pages/project/group.vue'
import ProjectProject from '~/pages/project/project.vue'
import ProjectCompany from '~/pages/project/company.vue'
import ProjectRole from '~/pages/project/role.vue'
import ResourceHost from '~/pages/resource/host.vue'
import ResourceConfig from '~/pages/resource/config.vue'
import UserRole from '~/pages/system/user/role.vue'
import UserUser from '~/pages/system/user/user.vue'
import TodoList from '~/pages/tools/todolist.vue'
import ToolsPass from '~/pages/tools/password.vue'
import Admin from '~/layouts/admin.vue'


const routes = [
    {
        path: "/",
        component: Admin,
        //子路由
        children: [{
            path: '/',
            component: Index,
            meta: {
                title: "后台首页"
            }
        },
        {
            path: '/system/menu',
            component: SystemMenu,
            meta: {
                title: "系统菜单"
            }
        },
        {
            path: '/system/settings',
            component: SystemSettings,
            meta: {
                title: "系统配置"
            }
        },
        {
            path: '/project/group',
            component: ProjectGroup,
            meta: {
                title: "项目Group"
            }
        },
        {
            path: '/project/company',
            component: ProjectCompany,
            meta: {
                title: "子公司"
            }
        },
        {
            path: '/project/project',
            component: ProjectProject,
            meta: {
                title: "项目列表"
            }
        },
        {
            path: '/project/role',
            component: ProjectRole,
            meta: {
                title: "项目角色"
            }
        },
        {
            path: '/resource/host',
            component: ResourceHost,
            meta: {
                title: "主机列表"
            }
        },
        {
            path: '/resource/config',
            component: ResourceConfig,
            meta: {
                title: "配置管理"
            }
        },
        {
            path: '/user/role',
            component: UserRole,
            meta: {
                title: "角色管理"
            }
        },
        {
            path: '/user/user',
            component: UserUser,
            meta: {
                title: "用户管理"
            }
        },
        {
            path: '/tools/todolist',
            component: TodoList,
            meta: {
                title: "备忘录"
            }
        },
        {
            path: '/tools/password',
            component: ToolsPass,
            meta: {
                title: "密码生成工具"
            }
        }
    ]
    },
    {
        path: '/login',
        component: Login,
        meta: {
            title: "登录页"
        }
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router