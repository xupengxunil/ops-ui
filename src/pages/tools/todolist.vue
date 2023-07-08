<template>

    <el-card shadow="never" class="border-0">
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
            <el-table-column prop="content" label="条目">
                <template v-slot="scope">
                    {{ scope.row.content }}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.type == 'todo'" class="ml-2" type="success">备忘录</el-tag>
                    <el-tag v-if="scope.row.type == 'idea'" class="ml-2" type="info">灵感</el-tag>
                    <el-tag v-if="scope.row.type == 'plan'" class="ml-2" type="warning">计划</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="status" label="状态">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.status == 'doing'" class="ml-2" type="success">进行中</el-tag>
                    <el-tag v-if="scope.row.status == 'done'" class="ml-2" type="info">已完成</el-tag>
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
                <el-form-item label="状态" prop="status">
                    <el-select filterable v-model="form.status" placeholder="状态">
                        <el-option label="进行中" value="doing" />
                        <el-option label="已完成" value="done" />
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select filterable v-model="form.type" placeholder="类型">
                        <el-option label="备忘" value="todo" />
                        <el-option label="灵感" value="idea" />
                        <el-option label="长期计划" value="plan" />
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input style="min-height: 100px; height: 400px;" type="textarea" v-model="form.content" placeholder="内容"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>

    </el-card>

</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount } from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import {
    getTodoList,
    createTodo,
    updateTodo,
    deleteTodo
} from "~/api/tools"
import { notifyMessage } from "~/composables/util"

const tableData = ref([])
const loading = ref(false)

//分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增")

function getData(p = null) {
    if (typeof p == "number") {
        currentPage.value = p
        console.log(p)
    }

    loading.value == true
    getTodoList(currentPage.value).then(res => {
        tableData.value = res.data
        total.value = res.count
    })
        .finally(() => {
            loading.value == false
        })
}

getData()


//删除

const handleDelete = (id) => {
    loading.value = true
    deleteTodo(id).then(res => {
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
    content: "",
    status: "",
    type: ""
})
const rules = {
}

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
        content: "",
        status: "doing",
        type: "todo"
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

        const fun = editId.value ? updateTodo(editId.value, form) : createTodo(form)

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

<style scoped>
:deep(.el-textarea__inner){
    min-height: 100px;
    height: 400px;
    }

:deep(.el-table .cell) {
white-space: pre-line;
}

</style>