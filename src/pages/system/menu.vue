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
        <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" border row-key="id" default-expand-all :loading="loading">
            <el-table-column prop="name" label="菜单名" sortable />
            <el-table-column prop="url" label="路径" sortable />
            <el-table-column prop="icon" label="图标" sortable />
            <el-table-column prop="sort" label="排序" sortable />
            <el-table-column prop="type" label="菜单类型">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.type == 1" class="ml-2">一级菜单</el-tag>
                    <el-tag v-if="scope.row.type == 2" class="ml-2" type="success">二级菜单</el-tag>
                    <el-tag v-if="scope.row.type == 3" class="ml-2" type="warning">权限</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
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


        <FormDialog ref="formDialogRef" :title="dialogTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="form.name" placeholder="菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="父菜单" prop="parentId">
                    <el-tree-select v-model="form.parentId" :data="treelist" :render-after-expand="false" check-strictly=true />
                </el-form-item>
                <el-form-item label="url路径" prop="url">
                    <el-input v-model="form.url" placeholder="url"></el-input>
                </el-form-item>
                <el-form-item label="icon名" prop="icon">
                    <el-input v-model="form.icon" placeholder="icon名称"></el-input>
                </el-form-item>
                <el-form-item label="排序权重" prop="sort">
                    <el-input v-model="form.sort" placeholder="排序权重"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型" prop="type">
                    <el-select filterable  v-model="form.type" placeholder="类型">
                        <el-option label="一级菜单" key="1"  value="1" />
                        <el-option label="二级菜单" key="2" value="2" />
                        <el-option label="权限" key="3" value="3" />
                    </el-select>
                </el-form-item>
            </el-form>
        </FormDialog>


    </el-card>

</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount } from "vue"
import FormDialog from "~/components/FormDialog.vue";
import {
    getMenuList,
    getMenuTreeList,
    createMenu,
    updateMenu,
    deleteMenu
} from "~/api/menu"
import { notifyMessage } from "~/composables/util"

const tableData = ref([])
const loading = ref(false)

//分页
const editId = ref(0)
const dialogTitle = computed(() => editId.value ? "修改" : "新增")

//搜索
const searchForm = reactive({
    keyword: ""
})

const resetSearchForm = () => {
    searchForm.keyword = ''
    getData()
}

function getData() {
    loading.value == true
    getMenuList().then(res => {
        tableData.value = res.data.menu
        console.log(tableData.value)
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
    deleteMenu(id).then(res => {
        notifyMessage("删除成功")
        getData()
    })
        .finally(() => {
            loading.value = false
        })
}

//表单部分

const formDialogRef = ref(null)
const treelist = ref([])
const formRef = ref(null)
const form = reactive({
    name: "",
    url: "",
    parentId: "",
    icon: "",
    type: "",
    sort: ""
})
const rules = {
}

//重置表单

function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate()
    if (row) {
        for (const key in form) {
            if (key === "parentId") {
                form["parentId"] = parseInt(row["parentId"])
                continue;
            }
            if (key === "type") {
                form["type"] = row["type"].toString()
                continue;
            }
            form[key] = row[key]
        }
    }
}

const handleCreate = () => {
    editId.value = 0
    resetForm({
        name: "",
    url: "",
    parentId: "",
    icon: "",
    type: "",
    sort: ""
})
    getMenuTreeList().then((res)=>{
        treelist.value = res.data.treelist
        formDialogRef.value.open()
    })
}

const handleEdit = (row) => {
    editId.value = row.id
    resetForm(row)
    getMenuTreeList().then((res)=>{
        treelist.value = res.data.treelist
        formDialogRef.value.open()
    })
}

const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return

        formDialogRef.value.showLoading()

        const fun = editId.value ? updateMenu(editId.value, form) : createMenu(form)

        fun.then(res => {
            notifyMessage(dialogTitle.value + "成功")
            getData()
            formDialogRef.value.close()
        })
            .finally(() => {
                formDialogRef.value.hideLoading()
            })
    })
}

</script>