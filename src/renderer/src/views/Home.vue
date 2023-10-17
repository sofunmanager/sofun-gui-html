<template>
    <el-container>
        <el-header>
            <Header :openSettings="openSettings" :addNewTab="addNewTab"/>
        </el-header>
        <el-main>
            <Content ref="contentRef"/>
        </el-main>
    
    </el-container>
    <Settings ref="settingsRef"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from "@/components/root/Header.vue"
import Content from "@/components/root/Content.vue"
import Settings from "@/components/Settings.vue"

import { getCurrentInstance } from "vue";
let globalProperties = getCurrentInstance()?.appContext.config.globalProperties;
let _global = globalProperties?.$global;

// 创建子组件的引用
const settingsRef  = ref(null)
const contentRef  = ref(null)

const openSettings=()=>{
    settingsRef.value.openSettings()
}

const addNewTab=()=>{
    contentRef.value.addNewTab()
}




</script>

<style scoped>
.el-container {
	width: 100%;
	height: 100%;
}

.el-header {
	padding: 0;
	width: 100%;
	top: 0;
}

.el-footer {
	padding: 0;
	width: 100%;
	height: 120px;
}

.el-main {
	padding: 0;
	width: 100%;
	height: calc(100% - 160px);
}
</style>
