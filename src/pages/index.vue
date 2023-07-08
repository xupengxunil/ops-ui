<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6" :offset="0" v-for="(item, index) in resData" :key="index">
                <el-card shadow="hover">
                    <template #header>
                        <div class="flex justify-between">
                            <span>{{ item.title }}</span>
                            <el-tag :type="item.color" effect="plain">
                                {{ item.unit }}
                            </el-tag>
                        </div>

                    </template>
                    <span>
                        {{ item.total }}
                    </span>
                    <el-divider />

                    <div class="flex justify-between">
                        <el-tag effect="plain">
                            生产： {{ item.prod }}
                        </el-tag>
                        <el-tag effect="plain" type="info">
                            非生产： {{ item.noprod }}
                        </el-tag>
                    </div>

                    <!-- card body -->
                </el-card>
            </el-col>
        </el-row>


    </div>
</template>

<script setup>

import {
    getdata
} from "~/api/data.js"

import { ref } from 'vue'

const resData = ref([])

getdata().then(res => {
    resData.value = res.data
    console.log(res)
})


</script>