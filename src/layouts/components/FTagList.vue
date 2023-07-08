<template>
    <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
        <el-tabs v-model="activeTab" type="card" class="demo-tabs" @tab-remove="removeTab" style="min-width:100px;"
            @tab-change="changeTab">
            <el-tab-pane :closable="item.path != '/'" v-for="item in tabList" :key="item.path" :label="item.title"
                :name="item.path">
            </el-tab-pane>
        </el-tabs>
        <span class="tag-btn">
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height:44px;">

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'

const route = useRoute()
const router = useRouter()
const cookie = useCookies()

const handleClose = (c) => {
    if (c == "clearAll") {
        //切换回首页
        activeTab.value = "/"

        //过滤只剩下首页
        tabList.value = [{
            title: '后台首页',
            path: '/'
        }]
    } else if (c == "clearOther") {
        //过滤只剩下首页或当前页面
        tabList.value = tabList.value.filter(tab => tab.path == "/" || tab.path == activeTab.value)
    }

    cookie.set("tabList", tabList.value)
}

const activeTab = ref(route.path)
const tabList = ref([
    {
        title: '后台首页',
        path: '/'
    }
])

const removeTab = (t) => {
    let tabs = tabList.value
    let a = activeTab.value
    if (a == t) {
        tabs.forEach((tab, index) => {
            if (tab.path == t) {
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                    a = nextTab.path
                }
            }
        })
    }

    activeTab.value = a
    tabList.value = tabList.value.filter(tab => tab.path != t)
    cookie.set("tabList", tabList.value)

}

function addTab(tab) {
    let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
    if (noTab) {
        tabList.value.push(tab)
    }
    cookie.set("tabList", tabList.value)
}

const changeTab = (t) => {
    activeTab.value = t
    router.push(t)
}

function initTabList() {
    let tbs = cookie.get("tabList")
    if (tbs) {
        tabList.value = tbs
    }
}

initTabList()

onBeforeRouteUpdate((to, from) => {
    activeTab.value = to.path
    addTab({
        title: to.meta.title,
        path: to.path
    })
})

</script>

<style scoped>
.f-tag-list {
    @apply fixed bg-gray-50 flex items-center;
    top: 50px;
    right: 0;
    height: 44px;
    position: fixed;
    z-index: 999; /* 保证在内容的上面*/
}

.tag-btn {
    @apply bg-light-50 rounded ml-auto flex justify-center items-center px-2;
    height: 32px;
    width: 32px;
}

:deep(.el-tabs__header) {
    @apply mb-0;
    border: 0 !important;
}

:deep(.el-tabs__nav) {
    border: 0 !important;
}

:deep(.el-tabs__item) {
    border: 0 !important;
    @apply bg-white mx-1 rounded;
    height: 32px;
    line-height: 32px;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
    line-height: 32px;
    height: 32px;
}

:deep(.is-disabled) {
    cursor: not-allowed;
    @apply text-gray-300;
}
</style>