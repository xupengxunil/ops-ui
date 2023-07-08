<template>
    <el-container>
        //固定导航栏
        <el-header class="fixed-header">
            <f-header />
        </el-header>
        <el-container>
            <el-aside :width="$store.state.asideWidth">
                <f-menu></f-menu>
            </el-aside>
            <el-main>
                <f-tag-list />
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import FHeader from './components/FHeader.vue'
import FMenu from './components/FMenu.vue'
import FTagList from './components/FTagList.vue'

</script>

<style>
.el-aside{
    transition: all 0.2s;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
</style>