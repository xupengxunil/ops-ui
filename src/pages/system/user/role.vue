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
            <el-table-column prop="name" label="角色名" />
            <el-table-column prop="desc" label="角色描述" width="180" />
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="openSetRule(scope.row)">配置权限</el-button>
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                    <el-popconfirm title="是否删除该条目?" confirmButtonText="确认" cancelButtonText="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">删除</el-button>
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
                <el-form-item label="角色名" prop="name">
                    <el-input v-model="form.name" placeholder="角色名"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="描述"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <!--权限配置-->
        <FormDrawer ref="setRuleformDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
            <el-tree-v2 ref="elTreeRef" node-key="id" :default-expanded-keys="defaultExpandedKeys" :data="rulelist"
                :props="{ label: 'name', children: 'children' }" show-checkbox :height="treeHeight"
                @check="handleTreeCheck" :check-strictly="checkStrictly">
                <template #default="{ node, data }">
                    <div class="flex items-center">
                        <el-tag :type="data.type == '3' ? 'success' : ''" size="small">
                            {{ data.type == 3 ? "权限" : "菜单" }}
                        </el-tag>
                    </div>
                    <span class="ml-2 text-sm">{{ data.name }}</span>
                </template>
            </el-tree-v2>
        </FormDrawer>


    </el-card>

</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount } from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import {
    getRoleList,
    createRole,
    updateRole,
    deleteRole,
    getMenuListAll
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
    getRoleList(currentPage.value, searchForm.keyword).then(res => {
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

const handleDelete = (id) => {
    loading.value = true
    deleteRole(id).then(res => {
        notifyMessage("删除成功")
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
    name: "",
    desc: "",
})
const rules = {
    name: [],
    desc: []
}

const menuList = ref([])

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

const handleEdit = (row) => {
    editId.value = row.id
    resetForm(row)
    formDrawerRef.value.open()
}

const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return

        formDrawerRef.value.showLoading()

        const fun = editId.value ? updateRole(editId.value, form) : createRole(form)

        fun.then(res => {
            notifyMessage(drawerTitle.value + "成功")
            getData(editId.value ? false : 1)
            formDrawerRef.value.close()
        })
            .finally(() => {
                formDrawerRef.value.hideLoading()
            })
    })
}

const setRuleformDrawerRef = ref(null)
const rulelist = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const elTreeRef = ref(null)
const ruleIds = ref([])
const defaultExpandedKeys = ref([])
const checkStrictly = ref(false)

const openSetRule = (row) => {
    roleId.value = row.id
    treeHeight.value = window.innerHeight - 170
    checkStrictly.value = true
    getMenuListAll().then((res) => {
        rulelist.value = res.data.menu
        defaultExpandedKeys.value = res.data.menu.map(o => o.id)
        setRuleformDrawerRef.value.open()

        //角色有的数据
        console.log(row.menulist.split(','))
        setTimeout(() => {
            elTreeRef.value.setCheckedKeys(row.menulist.split(',').map(item => parseInt(item)))
            checkStrictly.value = false
        }, 150)
    })
}

const handleSetRuleSubmit = () => {
    setRuleformDrawerRef.value.showLoading()
    updateRole(roleId.value, {'menulist':ruleIds.value.toString()})
    .then(res=>{
        notifyMessage('配置成功')
        getData()
        setRuleformDrawerRef.value.close()
    })
    .finally(()=>{
        setRuleformDrawerRef.value.hideLoading()
    })

}

const handleTreeCheck = (...e) => {
    const { checkedKeys, halfCheckedKeys } = e[1]
    ruleIds.value = [...checkedKeys,...halfCheckedKeys]
}

</script>