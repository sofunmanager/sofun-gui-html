<template>
  <el-dialog
    v-model="showPanel"
    :title="'更新内容 v'+currVersion"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="500px"
  >
    <ul>
      <li v-for="item in newVersion.info" :key="item">
        {{ item }}
      </li>
    </ul>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="readNewVersion">知道了</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { version as currVersion } from '../../../../package.json'
import { ElMessage, ElMessageBox } from 'element-plus'
let globalProperties = getCurrentInstance()?.appContext.config.globalProperties
let _global = globalProperties?.$global

const showPanel = ref(false)

const versionInfo = ref({
  '1.1.0': {
    info: [
      '修复tab标签名称显示异常',
      '优化输出文本格式',
      '优化代码高亮',
      '增加markdown语法支持',
      '增加表格支持'
    ]
  },
  '1.0.0': {
    info: ['正式版发布']
  }
})

const newVersion = ref({})

onMounted(() => {
  showNewVerssion()
})



const showNewVerssion = () => {
  let max_version = ''
  for (let v in versionInfo.value) {
    if (!max_version || v > max_version) {
      max_version = v
    }
  }
  let localVersion = window.localStorage.getItem(_global.storageKey.NEW_VERSION)

  if (max_version > currVersion && !localVersion) {
    ElMessageBox.alert(
      '有新的版本可以使用 <strong><i>' +
        max_version +
        '</i></strong><br/>当前版本为<strong><i>' +
        currVersion +
        '</i></strong>',
      '发现新版本',
      {
        confirmButtonText: '明白',
        dangerouslyUseHTMLString: true,
        callback: (action) => {}
      }
    )
  }
  
  if (!localVersion || localVersion != currVersion) {
    newVersion.value = versionInfo.value[currVersion]
    showPanel.value = true
  }
}

const readNewVersion = () => {
  window.localStorage.setItem(_global.storageKey.NEW_VERSION, currVersion)
  showPanel.value = false
}
</script>

<style scoped>
ul{
    padding: 0 20px; 
}
li{
    list-style: auto;
    line-height: 30px;
}

</style>