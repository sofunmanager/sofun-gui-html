<template>
  <div class="header-inner">
    <ul class="left-menu">
      <li>
        <el-button type="primary" :icon="Plus" @click="onNewTabClick"
          >新会话</el-button
        >
      </li>
    </ul>
    <ul class="right-menu">
      <li>
        <el-button :icon="Setting" @click="onSettingClick">设置</el-button>
      </li>
      <li>
        <el-switch
          v-model="darkMode"
          @change="setTheme"
          :active-action-icon="Moon"
          :inactive-action-icon="Sunny"
        ></el-switch>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Moon, Sunny, Setting, Plus} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";




//获取系统主题模式
const isDarkTheme_sys =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

let usedTheme = window.localStorage.getItem("_sofun_theme");
let darkMode = ref(usedTheme === "dark");

if (usedTheme) {
  setTheme(usedTheme === "dark");
} else {
  if (isDarkTheme_sys) {
    setTheme(true);
    darkMode = true;
  }
}

function setTheme(handle) {
  if (handle) {
    document.querySelector("html").classList.add("dark");
    window.localStorage.setItem("_sofun_theme", "dark");
  } else {
    document.querySelector("html").classList.remove("dark");
    window.localStorage.setItem("_sofun_theme", "light");
  }
}



const emits = defineEmits(["custom-event"]);

function onSettingClick() {
  emits("custom-event", "openSettings");
}
function onNewTabClick() {
  emits("custom-event", "addNewTab");
}
</script>

<style scoped>
.header-inner {
  position: relative;
  padding-right: 40px;
  background-image: radial-gradient(transparent 1px, var(--bg-color) 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px);
  top: 0;
  display: flex;
  white-space: nowrap;
}
.header-inner ul {
  width: 100%;
  line-height: var(--header-height);
  white-space: nowrap;
}
.header-inner .left-menu {
  width: 250px;
  min-width: 160px;
}
.header-inner li {
  display: inline-block;
  padding: 0 10px;
}
.header-inner .right-menu {
  text-align: right;
}
</style>
