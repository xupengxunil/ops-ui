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
            <el-table-column prop="project_group" label="项目组" >
                <template v-slot="scope">
                    {{scope.row.group.group_code}}
                </template>
            </el-table-column>
            <el-table-column prop="project_name" label="项目名" />
            <el-table-column prop="project_code" label="项目代号" width="180" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="hanleUserManager(scope.row)" >人员管理</el-button>
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
                <el-form-item label="项目GRP" prop="group_id">
                    <el-select filterable  v-model="form.group" placeholder="项目GRP">
                        <el-option v-for="item in groupList" :key="item.group_code" :label="item.group_name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="项目名" prop="project_name">
                    <el-input v-model="form.project_name" placeholder="项目名"></el-input>
                </el-form-item>
                <el-form-item label="项目code" prop="project_code">
                    <el-input v-model="form.project_code" placeholder="项目code"></el-input>
                </el-form-item>
            </el-form>
        </FormDialog>

        <!--权限配置-->
        <FormDialog ref="managerRoleformDialogRef" title="权限配置" @submit="handleSetRuleSubmit">
            <!-- 新增|刷新-->
            <div class="flex items-center justify-between mb-4">
                <el-form :model="userForm" ref="userFormRef" :rules="rules" :inline="true">
                    <el-form-item label="用户名" prop="user">
                        <el-select filterable v-model="userForm.user" placeholder="用户名">
                            <el-option v-for="item in userList" :key="item.username" :label="item.username" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色" prop="role">
                        <el-select filterable v-model="userForm.role" placeholder="角色">
                            <el-option v-for="item in roleList" :key="item.role_name" :label="item.role_name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-button type="primary"  @click="handleProjectUserCreate">添加到项目</el-button>
                <el-tooltip effect="dark" content="刷新数据" placement="top">
                    <el-button text @click="getProjectUserData">
                        <el-icon :size="20">
                            <Refresh />
                        </el-icon>
                    </el-button>
                </el-tooltip>
            </div>
            <!-- card body -->
            <el-table :data="projectUsertableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column prop="user" label="用户名" >
                    <template v-slot="scope">
                        {{scope.row.user.name}}
                    </template>
                </el-table-column>
                <el-table-column prop="role" label="角色">
                    <template v-slot="scope">
                        {{scope.row.role.role_name}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-popconfirm title="是否删除该条目?" confirmButtonText="确认" cancelButtonText="取消"
                            @confirm="handleProjectUserDelete(scope.row.id)">
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
        </FormDialog>

    </el-card>

</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount } from "vue"
import FormDialog from "~/components/FormDialog.vue";
import {
    getProjectList,
    createProject,
    updateProject,
    deleteProject,
    getProjectUserList,
    createProjectUser,
    deleteProjectUser,
    getUserList,
    getGroupListAll,
    getProjectRoleListAll
} from "~/api/project"
import { notifyMessage } from "~/composables/util"

const tableData = ref([])
const projectUsertableData = ref([])
const loading = ref(false)

//分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const userList = ref([])
const roleList = ref([])
const projectId = ref(0)

const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增")
const userForm = reactive({
    project: "",
    user: "",
    role: ""
})

const userFormRef = ref(null)
const managerRoleformDialogRef = ref(null)

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
    getProjectList(currentPage.value, searchForm.keyword).then(res => {
        tableData.value = res.data
        total.value = res.count
    })
        .finally(() => {
            loading.value == false
        })
}

//获取角色列表
function getRoleList() {
    getProjectRoleListAll().then(res => {
        roleList.value = res.data
        console.log('roleList: ',res.data)
    })
}
getRoleList()
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
    deleteProject(id).then(res => {
        notifyMessage("删除成功")
        getData()
    })
        .finally(() => {
            loading.value = false
        })
}

const handleProjectUserDelete = (id) => {
    loading.value = true
    deleteProjectUser(id).then(res => {
        notifyMessage("删除成功")
        refreshProjectUserList()
    })
        .finally(() => {
            loading.value = false
        })
}

//表单部分

const formDrawerRef = ref(null)
const formRef = ref(null)
const form = reactive({
    group: "",
    project_name: "",
    project_code: ""
})
const rules = {
    group: [],
    project_name: [],
    project_code: []
}

const groupList = ref([])

//重置表单

function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate()
    if (row) {
        for (const key in form) {
            if (key === "group") {
                form["group"] = row["group"]["id"]
                continue;
            }
            form[key] = row[key]
        }
    }
}

//置空表单
function resetUserForm(){
    for (const key in userForm) {
        userForm[key] = ""
    }
}

const handleCreate = () => {
    editId.value = 0
    resetForm({
        group: "",
    project_name: "",
    project_code: ""
})
    getGroupListAll().then(res => {
        groupList.value = res.data
        formDrawerRef.value.open()
    })
}

const handleProjectUserCreate = () => {
    userForm['project'] = projectId.value
    userFormRef.value.validate((valid) => {
        if (valid) {
            createProjectUser(userForm).then(res => {
                notifyMessage("添加成功")
                refreshProjectUserList()
            })
        }
    })
}

const refreshProjectUserList = () => {
    getProjectUserList(projectId.value).then(res => {
        projectUsertableData.value = res.data
    })
}

const hanleUserManager = (row) => {
    userForm['project'] = row.id
    resetUserForm()
    projectId.value = row.id
    getProjectUserList(row.id).then(res => {
        projectUsertableData.value = res.data
        getUserList().then(res => {
            userList.value = res.data
            console.log('userList: ',res.data)
        })
        managerRoleformDialogRef.value.open()
    })
}

const handleEdit = (row) => {
    editId.value = row.id
    resetForm(row)
    getGroupListAll().then(res => {
        groupList.value = res.data
        formDrawerRef.value.open()
    })
}

const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return

        formDrawerRef.value.showLoading()

        const fun = editId.value ? updateProject(editId.value, form) : createProject(form)

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