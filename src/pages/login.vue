<template>
    <el-row class="login-container">
        <el-col :lg="16" :md="12" class="left">
            <div>
                <div>ops</div>
            </div>
        </el-col>
        <el-col :lg="8" :md="12" class="right">
            <!--左侧边栏-->
            <h2 class="title">欢迎回来</h2>
            <div>
                <span class="line"></span>
                <span>账号密码登录</span>
                <span class="line"></span>
            </div>
            <el-form :rules="rules" ref="ruleFormRef" :model="form" class="w-[250px]">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码" show-password>
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-radio-group v-model="form.ldap">
                        <el-radio :label="1">LDAP</el-radio>
                        <el-radio :label="0">本地登录</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button class="w-[250px]" round type="primary" @click="onSubmit" :loading="loading">登
                        录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script setup>

import { reactive, ref, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { notifyMessage } from '../composables/util'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()

// do not use same name with ref
const form = reactive({
    username: '',
    password: '',
    ldap: 1
})

const rules = {
    username: [
        {
            required: true, message: '用户名不能为空', trigger: 'blur'
        }
    ],
    password: [
        {
            required: true, message: '密码不能为空', trigger: 'blur'
        }
    ]
}

const ruleFormRef = ref(null)
const loading = ref(false)

const onSubmit = () => {
    ruleFormRef.value.validate((valid) => {
        if (!valid) {
            return false
        }
        loading.value = true

        console.log(form)

        store.dispatch("login", form).then(res => {
            notifyMessage("登录成功")
            router.push("/")
        }).finally(() => {
            loading.value = false
        })
    })
    console.log('submit!')
}


//监听回车事件
function onKeyUp(e) {
    if (e.key == "Enter") onSubmit()
}

//添加键盘监听
onMounted(() => {
    document.addEventListener("keyup", onKeyUp)
})

onBeforeMount(() => {
    document.removeEventListener("keyup", onKeyUp)
})

</script>

<style scoped>
.login-container {
    @apply min-h-screen bg-blue-500;
}

.left {
    @apply flex items-center justify-center;
}

.left>div>div:first-child {
    @apply font-bold text-5xl text-light-50;
}

.left>div>div:last-child {
    @apply text-gray-300;
}

.right {
    @apply bg-light-50 flex items-center justify-center flex-col;
}

.right .title {
    @apply font-bold items-center justify-center text-gray-800;
}

.right .line {
    @apply h-[1px] w-16 bg-gray-200;
}

.right>div {
    @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}
</style>