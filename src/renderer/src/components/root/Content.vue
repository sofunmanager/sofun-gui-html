<template>
  <el-tabs
    v-model="activeName"
    type="card"
    class="tabs-main"
    closable
    @tab-remove="removeTab"
    @tab-change="onTabChange"
  >
    <el-tab-pane v-for="item in tabs" :key="item.id" :name="item.id">
      <template #label>
        <span class="custom-tabs-label">
          <!-- <el-dropdown @command="onSesstionTypeChange($event,item.id)">
          <span class="el-dropdown-link">
            <el-icon :size="20">
              <ChatLineSquare v-if="!item.type || item.type === 'caht'"/>
              <Tickets v-if="item.type === 'completion'"/>
              <EditPen v-if="item.type === 'edit'"/>
              
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu >

              <el-dropdown-item command="caht" :icon="typeIcon.caht.icon" :title="typeIcon.caht.text">
                {{typeIcon.caht.name}}
              </el-dropdown-item>
              <el-dropdown-item command="completion" :icon="typeIcon.completion.icon" :title="typeIcon.completion.text">
                {{typeIcon.completion.name}}
              </el-dropdown-item>
              <el-dropdown-item command="edit" :icon="typeIcon.edit.icon" :title="typeIcon.edit.text">
                {{typeIcon.edit.name}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->

          <span class="tab-title">{{ item.title ? item.title : '新建会话' }}</span>
        </span>
      </template>

      <SessionList :sesstionId="item.id" :sesstionType="currSesstionType" :rename="renameTab" />
    </el-tab-pane>
    <el-empty description="没有任何会话~" />
  </el-tabs>
</template>
<script setup>
import SessionList from '@/components/SessionList.vue'
import { ref, getCurrentInstance } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ArrowDown, ChatLineSquare, EditPen, Tickets } from '@element-plus/icons-vue'

let globalProperties = getCurrentInstance()?.appContext.config.globalProperties
let _global = globalProperties?.$global
const tabs = ref([])
const activeName = ref('')
let local_a_t = window.localStorage.getItem(_global.storageKey.ACTIVE_TAB)
activeName.value = local_a_t

let localTabs = window.localStorage.getItem(_global.storageKey.SE_LIST)
if (localTabs) {
  tabs.value = JSON.parse(localTabs)
}

const cutTit = (title) => {
  if (title.length > 6) {
    title = title.substring(0, 6) + '...'
  }
  return title
}

const removeTab = (key) => {
  ElMessageBox.confirm('移除这个会话吗?', '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let index
    tabs.value.forEach((e, i) => {
      if (e.id === key) {
        index = i
      }
    })

    let arr = tabs.value
    //总数大于2执行tab激活逻辑
    if (arr.length > 1) {
      //关闭的是非激活窗口则忽略
      if (arr[index].id === activeName.value) {
        //非第一个激活
        if (index > 0) {
          activeName.value = arr[index - 1].id
        } else {
          activeName.value = arr[index + 1].id
        }
      }
    }
    tabs.value.splice(index, 1)
    save()
    window.localStorage.removeItem(_global.storageKey.SE + '_' + key)
  })
}
const onTabChange = (e) => {
  activeName.value = e
  window.localStorage.setItem(_global.storageKey.ACTIVE_TAB, e)
}

const typeIcon = ref({
  caht: {
    icon: ChatLineSquare,
    text: '常规对话、问题解答',
    name: '聊天对话'
  },
  completion: {
    icon: Tickets,
    text: '内容续写,偏向于文本创作',
    name: '内容补全'
  },
  edit: {
    icon: EditPen,
    text: '擅长对现有内容二次处理',
    name: '文本编辑'
  }
})

const currSesstionType = ref('')
const onSesstionTypeChange = (command, id) => {
  console.log(command, id)
  console.log(tabs.value[id])

  tabs.value.forEach((e) => {
    if (e.id === id) {
      e.type = command
    }
  })
  currSesstionType.value = command
  save()
}

const addNewTab = () => {
  let id = new Date().getTime() + ''
  tabs.value.push({
    id: id,
    title: ''
  })
  activeName.value = id
  save()
}

const renameTab = (id, title) => {
  tabs.value.forEach((e) => {
    if (e.id === id) {
      e.title = title
    }
  })
  save()
}
const save = () => {
  window.localStorage.setItem(_global.storageKey.SE_LIST, JSON.stringify(tabs.value))
}

//暴露
defineExpose({
  addNewTab,
  renameTab
})
</script>

<style scoped>
.tabs-main {
  width: 100%;
  height: 100%;
}

.tab-title {
  padding-left: 5px;

  max-width: 100px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

::v-deep .el-tabs__header {
  margin: 0;
}
::v-deep .el-tabs__content {
  height: calc(100% - 50px);
}
::v-deep .el-tab-pane {
  height: 100%;
}
</style>
