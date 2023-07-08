<template>
    <el-card shadow="never" class="border-0">
        <!--搜索-->


        <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
            <el-row :gutter="20">
                <el-col :span="6" :offset="0">
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :offset="0">
                    <el-form-item label="项目">
                        <el-select filterable clearable  v-model="searchForm.project" placeholder="项目名称" @change="getData()">
                            <el-option v-for="item in projectList" :key="item.project_code" :label="item.project_code"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :offset="0">
                    <el-form-item label="环境">
                        <el-select filterable clearable  v-model="searchForm.env" placeholder="项目名称" @change="getData()">
                            <el-option v-for="item in envList" :key="item.name" :label="item.name"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5" :offset="0">
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
            <el-table-column prop="project_name" label="项目">
                <template v-slot="scope">
                    {{ scope.row.project.project_name }}
                </template>
            </el-table-column>
            <el-table-column prop="project_code" label="项目Code">
                <template v-slot="scope">
                    {{ scope.row.project.project_code }}
                </template>
            </el-table-column>
            <el-table-column prop="key" label="名称" width="180" />
            <el-table-column prop="value" label="对应值" width="150" />
            <el-table-column prop="description" label="描述" width="150" />
            <el-table-column prop="env" label="环境">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.env == 'prod'" class="ml-2" type="success">生产</el-tag>
                    <el-tag v-if="scope.row.env == 'pprd'" class="ml-2" type="info">预生产</el-tag>
                    <el-tag v-if="scope.row.env == 'uat'" class="ml-2" type="info">UAT</el-tag>
                    <el-tag v-if="scope.row.env == 'test'" class="ml-2" type="info">测试</el-tag>
                    <el-tag v-if="scope.row.env == 'dev'" class="ml-2" type="info">开发</el-tag>
                </template>
            </el-table-column>
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

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="项目名称" prop="project">
                    <el-select filterable v-model="form.project" placeholder="项目名称">
                        <el-option v-for="item in projectList" :key="item.project_code" :label="item.project_code"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="键名称" prop="key">
                    <el-input v-model="form.key" placeholder="键名称"></el-input>
                </el-form-item>
                <el-form-item label="对应值" prop="value">
                    <el-input v-model="form.value" placeholder="对应值"></el-input>
                </el-form-item>
                <el-form-item label="环境" prop="env">
                    <el-select filterable v-model="form.env" placeholder="环境">
                        <el-option label="测试" value="test" />
                        <el-option label="开发" value="dev" />
                        <el-option label="UAT" value="uat" />
                        <el-option label="预生产" value="pprd" />
                        <el-option label="生产" value="prod" />
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description" :rows="2" type="textarea" placeholder="键值描述" />
                </el-form-item>
            </el-form>
        </FormDrawer>

    </el-card>

</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount } from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import {
    getConfigList,
    createConfig,
    updateConfig,
    deleteConfig,
    getProjectListAll
} from "~/api/resource"
import { notifyMessage } from "~/composables/util"

const envList = [
    {
        name: '测试',
        value: 'test'
    },
    {
        name: '开发',
        value: 'dev'
    },
    {
        name: 'UAT',
        value: 'uat'
    },
    {
        name: '预生产',
        value: 'pprd'
    },
    {
        name: '生产',
        value: 'prod'
    },
]

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
    keyword: "",
    project: "",
    env: ""
})

const resetSearchForm = () => {
    searchForm.keyword = ''
    searchForm.project = ''
    searchForm.env = ''
    getData()
}

function getData(p = null) {
    if (typeof p == "number") {
        currentPage.value = p
        console.log(p)
    }

    loading.value == true
    getConfigList(currentPage.value, searchForm.keyword, searchForm.project, searchForm.env).then(res => {
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
    deleteConfig(id).then(res => {
        if (res.error) {
            notifyMessage(res.error, "error")
        } else {
            notifyMessage("删除成功")
            getData()
        }
    })
        .finally(() => {
            loading.value = false
        })
}

//表单部分s

const formDrawerRef = ref(null)
const formRef = ref(null)
const form = reactive({
    project_name: "",
    project_code: "",
    project: "",
    key: "",
    env: "",
    value: "",
    description: "",
    create_time: "",
    update_time: "",
})
const rules = {
}

const projectList = ref([])

//重置表单

function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate()
    if (row) {
        for (const key in form) {
            if (key === "project") {
                form["project"] = row["project"]["id"]
                continue;
            }
            form[key] = row[key]
        }
    }
}

const handleCreate = () => {
    editId.value = 0
    resetForm({
        project_name: "",
        project_code: "",
        project: "",
        key: "",
        env: "",
        value: "",
        description: "",
        create_time: "",
        update_time: ""
    })
    formDrawerRef.value.open()
}

getProjectListAll().then(res => {
    projectList.value = res.data
})

const handleEdit = (row) => {
    editId.value = row.id
    resetForm(row)
    getProjectListAll().then(res => {
        projectList.value = res.data
        formDrawerRef.value.open()
    })
}

const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return

        formDrawerRef.value.showLoading()

        const fun = editId.value ? updateConfig(editId.value, form) : createConfig(form)

        fun.then(res => {

            if (res.error) {
                notifyMessage(res.error, "error")
            } else {
                notifyMessage(drawerTitle.value + "成功")
                getData(editId.value ? false : 1)
                formDrawerRef.value.close()
            }


        })
            .finally(() => {
                formDrawerRef.value.hideLoading()
            })
    })
}



</script>