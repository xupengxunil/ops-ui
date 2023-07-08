<template>
    <el-card shadow="never" class="border-0">
        <!--搜索-->


        <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
            <el-row :gutter="20">
                <el-col :span="8" :offset="0">
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="8">
                    <div class="flex  items-centter justify-center">
                        <el-button type="primary" @click="getData">搜索</el-button>
                        <el-button @click="resetSearchForm">重置</el-button>
                    </div>
                </el-col>
            </el-row>


        </el-form>

        <!-- 新增|刷新-->
        <div class="flex items-center justify-between mb-4">
            <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
            <el-tooltip effect="dark" content="刷新数据" placement="top">
                <el-button text @click="getData">
                    <el-icon :size="20">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
        <!-- card body -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="role" label="角色" width="180" >
                <template #default="scope">
                    {{ scope.row.role.name }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handleEditRole(scope.row)">修改角色</el-button>
                    <el-popconfirm :title="scope.row.is_active ? '是否冻结?' : '是否激活?'" confirmButtonText="确认" cancelButtonText="取消"
                        @confirm="handleChangeRole(scope.row.id,scope.row.is_active)">
                        <template #reference>
                            <el-button text type="primary" size="small">{{ scope.row.is_active ? "冻结" : "激活" }}</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex items-center justify-center mt-5">
            <el-pagination backgroud layout="prev,pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData"></el-pagination>
        </div>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="角色" prop="role">
                    <el-select filterable  v-model="form.role" placeholder="角色">
                        <el-option v-for="item in roleList" :key="item.name" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
        </FormDrawer>


    </el-card>

</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount } from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import {
    getAllRoleList,
    getUserList,
    updateUser,
    changeUserStatus
} from "~/api/user"
import { notifyMessage } from "~/composables/util"

const tableData = ref([])
const loading = ref(false)

//分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增")

//搜索
const searchForm = reactive({
    keyword: ""
})

const resetSearchForm = () => {
    searchForm.keyword = ''
    getData()
}

function getData(p = null) {
    if (typeof p == "number") {
        currentPage.value = p
        console.log(p)
    }

    loading.value == true
    getUserList(currentPage.value, searchForm.keyword).then(res => {
        tableData.value = res.data
        total.value = res.count
    })
        .finally(() => {
            loading.value == false
        })
}

getData()

//监听回车事件
function onKeyUp(e) {
    if (e.key == "Enter") getData()
}

//添加键盘监听
onMounted(() => {
    document.addEventListener("keyup", onKeyUp)
})

onBeforeMount(() => {
    document.removeEventListener("keyup", onKeyUp)
})

//删除

const handleChangeRole = (id,is_active) => {
    loading.value = true
    let active = is_active ? '0' : '1'
    changeUserStatus(id,active).then(res => {
        notifyMessage("修改成功")
        getData()
    })
        .finally(() => {
            loading.value = false
        })
}

//表单部分

const formDrawerRef = ref(null)
const formRef = ref(null)
const form = reactive({
    role: ""
})
const rules = {
    role: []
}

const roleList = ref([])

//重置表单

function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate()
    if (row) {
        for (const key in form) {
            form[key] = row[key]
        }
    }
}

const handleCreate = () => {
    editId.value = 0
    resetForm({
        name: "",
        desc: ""
    })
    formDrawerRef.value.open()
}

const handleEditRole = (row) => {
    editId.value = row.id
    resetForm(row)
    getAllRoleList().then((res)=>{
        roleList.value = res.data
        formDrawerRef.value.open()
    })
}

const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return

        formDrawerRef.value.showLoading()
        updateUser(editId.value, form).then(res => {
            notifyMessage(drawerTitle.value + "成功")
            getData(editId.value ? false : 1)
            formDrawerRef.value.close()
        })
            .finally(() => {
                formDrawerRef.value.hideLoading()
            })
    })
}

</script>