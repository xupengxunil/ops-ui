<template>
    <div class="f-menu" :style="{ width: $store.state.asideWidth }">
        <el-menu class="border-0"  @select="handleSelect" :collapse = "isCollapse" :collapse-transition="false" unique-opened :default-active="defaultActive" >
            <template v-for="(item, index) in asideMenus" :key="index">
                <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="(item2, index2) in item.children" ::key="index2" :index="item2.url">
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :index="item.url">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script setup>
import { computed,ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()

//默认选中
const defaultActive = ref(route.path)

//是否折叠
const isCollapse = computed(()=>!(store.state.asideWidth == '250px'))

const asideMenus = computed(()=>store.state.menus)

const router = useRouter()

const handleSelect = (c) => {
    router.push(c)
}

</script>

<style>
.f-menu {
    transition: all 0.2s;
    top: 50px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    @apply shadow-md fixed bg-light-50;
}
</style>