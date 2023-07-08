<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-3">
                <Cpu />
            </el-icon>
            OPS
        </span>
        <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
            <Fold v-if="$store.state.asideWidth == '250px'" />
            <Expand v-else/>
        </el-icon>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-btn" @click="handleRefresh">
                <refresh />
            </el-icon>
        </el-tooltip>
        <div class="flex justify-center items-center ml-auto">
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <Aim v-else />
                </el-icon>
            </el-tooltip>

            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center text-light-100">
                    <el-avatar class="mr-3" :size="25" :src="avatarUrl" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
        <el-form :rules="rules" ref="ruleFormRef" :model="form" label-width="80px" size="small">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码" show-password>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input v-model="form.password" placeholder="请输入新密码" show-password>
                </el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input v-model="form.repassword" placeholder="请输入确认密码" show-password>
                </el-input>
            </el-form-item>
        </el-form>
    </form-drawer>

</template>

<script setup>

import FormDrawer from "../../components/FormDrawer.vue";
import { useFullscreen } from "@vueuse/core";
import { useRepassword, useLogout } from '~/composables/useManager'

const {
    form,
    rules,
    ruleFormRef,
    formDrawerRef,
    openRepassword,
    onSubmit
} = useRepassword()


const {
    handleLogout
} = useLogout()

const {
    //是否全屏状态
    isFullscreen,
    toggle
} = useFullscreen()

const avatarUrl = "http://118.31.106.70/nginx-logo.png"


const handleRefresh = () => location.reload()
const handleCommand = (c) => {
    switch (c) {
        case "logout":
            handleLogout()
            break;
        case "rePassword":
            openRepassword()
            console.log('repassword')
            break;
    }
}





</script>

<style>
.f-header {
    @apply flex items-center justify-center text-light-50 fixed top-0 left-0 right-0;
    background: #545c64;
    height: 50px;
}

.logo {
    width: 200px;
    @apply flex justify-center items-center
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 50px;
    cursor: pointer;
}

.icon-btn:hover {
    background: #545c64;
}

.f-header .dropdown {
    height: 50px;
    cursor: pointer;
    @apply flex justify-center items-center mx-5;
}
</style>