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
            <el-table-column prop="group_cn" label="子公司" >
                <template v-slot="scope">
                    {{scope.row.group_cn.company_nickname}}
                </template>
            </el-table-column>
            <el-table-column prop="group_name" label="项目名" />
            <el-table-column prop="group_code" label="代号" width="180" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
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

        <FormDialog ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="子公司" prop="group_cn">
                    <el-select filterable  v-model="form.group_cn" placeholder="子公司">
                        <el-option v-for="item in companyList" :key="item.company_code" :label="item.company_nickname" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="项目中文名" prop="group_name">
                    <el-input v-model="form.group_name" placeholder="项目中文名"></el-input>
                </el-form-item>
                <el-form-item label="项目code" prop="group_code">
                    <el-input v-model="form.group_code" placeholder="项目code"></el-input>
                </el-form-item>
            </el-form>
        </FormDialog>

    </el-card>

</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount } from "vue"
import FormDialog from "~/components/FormDialog.vue";
import {
    getCompanyListAll,
    getGroupList,
    createGroup,
    updateGroup,
    deleteGroup
} from "~/api/project"
import { notifyMessage } from "~/composables/util"

const companyList =ref([])
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
    getGroupList(currentPage.value, searchForm.keyword).then(res => {
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
    deleteGroup(id).then(res => {
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
    group_cn: "",
    group_name: "",
    group_code: ""
})
const rules = {
    group_cn: [],
    group_code: [],
    group_name: []
}


//重置表单

function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate()
    if (row) {
        for (const key in form) {
            if (key === "group_cn") {
                form["group_cn"] = row["group_cn"]["id"]
                continue;
            }
            form[key] = row[key]
        }
    }
}

const handleCreate = () => {
    editId.value = 0
    resetForm({
    group_cn: "",
    group_name: "",
    group_code: ""
})
getCompanyListAll().then(res => {
    companyList.value = res.data
        formDrawerRef.value.open()
    })
}

const handleEdit = (row) => {
    editId.value = row.id
    resetForm(row)
    getCompanyListAll().then(res => {
        companyList.value = res.data
        formDrawerRef.value.open()
    })
}

const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return

        formDrawerRef.value.showLoading()

        const fun = editId.value ? updateGroup(editId.value, form) : createGroup(form)

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



</script>