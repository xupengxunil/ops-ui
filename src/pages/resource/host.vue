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
                        <el-select filterable clearable v-model="searchForm.project" placeholder="项目名称" @change="getData()">
                            <el-option v-for="item in projectList" :key="item.project_code" :label="item.project_code"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :offset="0">
                    <el-form-item label="环境">
                        <el-select filterable clearable v-model="searchForm.env" placeholder="项目名称" @change="getData()">
                            <el-option v-for="item in envList" :key="item.name" :label="item.name" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :offset="0">
                    <div class="flex  items-centter justify-center">
                        <el-button type="primary" @click="getData">搜索</el-button>
                        <el-button @click="resetSearchForm">重置</el-button>
                    </div>
                </el-col>
            </el-row>


        </el-form>

        <!-- 新增|刷新-->
        <div class="flex items-center justify-between mb-4">
            <el-button type="primary" size="small" @click="handleCreate()">新增</el-button>
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
            <el-table-column prop="app" label="应用名" />
            <el-table-column prop="hostname" label="主机名" width="180" />
            <el-table-column prop="ip_address" label="IP" width="150" />
            <el-table-column prop="operating_system" label="操作系统" />
            <el-table-column prop="cpu_cores" label="CPU" />
            <el-table-column prop="memory_size" label="内存" />
            <el-table-column prop="disk_space" label="磁盘" />
            <el-table-column prop="monitor_port" label="监控端口" />
            <el-table-column prop="env" label="环境">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.env == 'prod'" class="ml-2" type="success">生产</el-tag>
                    <el-tag v-if="scope.row.env == 'pprd'" class="ml-2" type="info">预生产</el-tag>
                    <el-tag v-if="scope.row.env == 'uat'" class="ml-2" type="info">UAT</el-tag>
                    <el-tag v-if="scope.row.env == 'test'" class="ml-2" type="info">测试</el-tag>
                    <el-tag v-if="scope.row.env == 'dev'" class="ml-2" type="info">开发</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.status == 'running'" class="ml-2" type="success">运行中</el-tag>
                    <el-tag v-if="scope.row.status == 'stop'" class="ml-2" type="info">已停止</el-tag>
                </template>
            </el-table-column>
            <!--管理按钮，下拉菜单-->
            <el-table-column label="管理" width="300" align="center">
                <template #default="scope">
                    <el-dropdown @command="(command) => {
                            handleCommand(command, scope.row);
                        }">
                        <el-link type="primary" :underline="false" style="margin-left: 10px">运维操作</el-link>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="viewRootPass">查看Root密码</el-dropdown-item>
                                <el-dropdown-item command="rootPass">修改Root密码</el-dropdown-item>
                                <el-dropdown-item command="diskExtend">扩充磁盘分区</el-dropdown-item>
                                <el-dropdown-item command="resetHostname">修改主机名</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" title="主机信息同步" text @click="SyncOsInfo(scope.row)">
                        <el-icon :size="20">
                            <Refresh />
                        </el-icon>
                    </el-button>
                    <el-button type="primary" size="small" title="修改" text @click="handleEdit(scope.row)">
                        <el-icon :size="20">
                            <Edit />
                        </el-icon>
                    </el-button>
                    <el-button type="primary" size="small" title="克隆" text @click="handleCreate(scope.row)">
                        <el-icon :size="20">
                            <CopyDocument />
                        </el-icon>
                    </el-button>

                    <el-popconfirm title="是否删除该条目?" confirmButtonText="确认" cancelButtonText="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button text type="danger" title="删除" size="small">
                                <el-icon :size="20">
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex items-center justify-center mt-5">
            <el-pagination backgroud layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
                @current-change="getData"></el-pagination>

        </div>

        <!--查看Root密码Dialog-->
        <el-dialog title="查看Root密码" v-model="viewPassDialog" width="30%">
            <el-form :model="viewPassform" label-width="100px">
                <el-form-item label="Root密码">
                    <el-input v-model="viewPassform.password" placeholder="Root密码" readonly></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--修改Root密码Dialog-->
        <FormDialog ref="resetPassformDialogRef" :title="修改Root密码" @submit="handleResetRootPass">
            <el-form :model="resetPassform" ref="resetPassformRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="密码" prop="password">
                    <el-input v-model="resetPassform.password" placeholder="密码"></el-input>
                </el-form-item>
                <!--重新生成随机密码按钮-->
                <el-form-item>
                    <el-button type="primary" size="small" @click="resetRandomPassword">重新生成随机密码</el-button>
                </el-form-item>
            </el-form>
        </FormDialog>




        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="项目名称" prop="project">
                    <el-select filterable v-model="form.project" placeholder="项目名称">
                        <el-option v-for="item in projectList" :key="item.project_code" :label="item.project_code"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="主机名" prop="hostname">
                    <el-input v-model="form.hostname" placeholder="主机名"></el-input>
                </el-form-item>
                <el-form-item label="应用名" prop="app">
                    <el-input v-model="form.app" placeholder="应用名"></el-input>
                </el-form-item>
                <el-form-item label="主机IP" prop="ip_address">
                    <el-input v-model="form.ip_address" placeholder="主机IP"></el-input>
                </el-form-item>
                <el-form-item label="操作系统类型" prop="operating_system">
                    <el-select filterable v-model="form.operating_system" placeholder="操作系统类型">
                        <el-option label="Windows" value="Windows" />
                        <el-option label="Linux" value="Linux" />
                    </el-select>
                </el-form-item>
                <el-form-item label="监控端口" prop="monitor_port">
                    <el-input-number v-model="form.monitor_port" :min="9100" :max="10000" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select filterable v-model="form.status" placeholder="状态">
                        <el-option label="运行中" value="running" />
                        <el-option label="已关机" value="stop" />
                    </el-select>
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
            </el-form>
        </FormDrawer>

    </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount } from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import {
    getHostList,
    createHost,
    updateHost,
    deleteHost,
    syncOsInfo,
    getProjectListAll,
    resetRootPass,
    getRootPass
} from "~/api/resource"
import { notifyMessage } from "~/composables/util"
import { randomPassword } from "~/utils/ops"

const tableData = ref([])
const loading = ref(false)

//分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(15)

const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增")

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
//搜索
const searchForm = reactive({
    keyword: "",
    project: "",
    env: ""
})

//密码重置部分
const resetPassform = reactive({
    password: "",
    host_id: ''
})

const resetPassformRef = ref(null)
const resetPassformDialogRef = ref(null)

//密码查看部分
const viewPassform = reactive({
    password: ""
})
const viewPassDialog = ref(false)

const resetSearchForm = () => {
    searchForm.keyword = ''
    searchForm.project = ''
    searchForm.env = ''
    searchForm.app = ''
    getData()
}

const handleCommand = (command, row) => {
    console.log(command, row)
    editId.value = row.id
    // 根据 command 执行相应的操作
    switch (command) {
        case 'viewRootPass':
            // 执行查看密码的操作
            console.log('viewRootPass')
            getRootPass(row.id).then(res => {
                viewPassform.password = res.data.password
                viewPassDialog.value = true
            })
            break;
        case 'rootPass':
            // 执行重置root密码的操作
            console.log('rootPass')
            resetPassform.password = randomPassword()
            resetPassform.host_id = row.id
            resetPassformDialogRef.value.open()
            break;
        case 'diskExtend':
            // 执行选项2的操作
            console.log('diskExtend')
            break;
        case 'reset':
            // 执行选项3的操作
            console.log('reset')
            break;
        default:
            break;
    }
}

//重新生成随机密码
const resetRandomPassword = () => {
    resetPassform.password = randomPassword()
}

const handleResetRootPass = () => {
    resetPassformRef.value.validate().then(() => {
        resetRootPass(resetPassform).then(res => {
            notifyMessage(res)
            resetPassformDialogRef.value.close()
        })
    })
}

function getData(p = null) {
    if (typeof p == "number") {
        currentPage.value = p
        console.log(p)
    }

    loading.value = true
    getHostList(currentPage.value, searchForm.keyword, searchForm.project, searchForm.env, searchForm.app).then(res => {
        tableData.value = res.data.data
        total.value = res.data.count
    })
        .finally(() => {
            loading.value = false
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
    deleteHost(id).then(res => {
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

//表单部分

const formDrawerRef = ref(null)
const formRef = ref(null)
const form = reactive({
    project_name: "",
    project_code: "",
    project: "",
    hostname: "",
    env: "",
    app: "",
    ip_address: "",
    description: "",
    status: "",
    create_time: "",
    update_time: "",
    monitor_port: "",
    operating_system: ""
})
const rules = {
    hostname: [],
    ip_address: [],
    cpu_cores: [],
    memory_size: [],
    disk_space: [],
    description: [],
    status: [],
    app: [],
    operating_system: []
}

const projectList = ref([])
const url = ref(null)

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

const handleCreate = (row = false) => {
    editId.value = 0
    if (row) {
        for (const key in form) {
            if (key === "project") {
                form["project"] = row["project"]["id"]
                continue;
            }
            form[key] = row[key]
        }
    }
    else {
        resetForm({
            project_name: "",
            project_code: "",
            project: "",
            env: "",
            hostname: "",
            ip_address: "",
            description: "",
            status: "",
            create_time: "",
            app: "app",
            update_time: "",
            monitor_port: 9100,
            operating_system: ""
        })
    }
    formDrawerRef.value.open()
}

getProjectListAll().then(res => {
    projectList.value = res.data
})


const SyncOsInfo = (row) => {

    loading.value = true
    console.log(loading)
    syncOsInfo(row.id).then(res => {

        if (res.error) {
            notifyMessage(res.error, "error")
        } else {
            notifyMessage("同步信息成功")
            getData()
        }


    }).finally(() => {
        loading.value = false
    })
}


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

        const fun = editId.value ? updateHost(editId.value, form) : createHost(form)

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