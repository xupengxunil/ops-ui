<template>
    <el-dialog  v-model="showDialog" :close-on-click-modal="false" :title="title" :width="width"
        :destroy-on-close="destroyOnClose">
        <div class="formDialog">
            <div class="body">
                <slot></slot>
            </div>
            <div class="actions">
                <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
                <el-button type="default" @click="close">取消</el-button>

            </div>
        </div>
    </el-dialog>
</template>

<script setup>

import { ref } from 'vue'
const showDialog = ref(false)
const loading = ref(false)

const props = defineProps({
    title: String,
    width: {
        type: String,
        default: "50%"
    },
    destroyOnClose: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: "提交"
    }
})

const showLoading = () => loading.value = true
const hideLoading = () => loading.value = false

//open
const open = () => showDialog.value = true

//close
const close = () => showDialog.value = false

const emit = defineEmits(["submit"])
const submit = () => emit("submit")

//向父组件暴露以下方法
defineExpose({
    open,
    close,
    showLoading,
    hideLoading
})

</script>

<style>
.formDialog {
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.formDialog .body {
    flex: 1;
    overflow-y: auto;
}

.formDialog .actions {
    height: 50px;
    @apply mt-auto flex items-center
}
</style>