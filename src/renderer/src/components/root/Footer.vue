<template>
  <div class="footer">
    <el-input
      v-model="inputText"
      :rows="5"
      resize="none"
      type="textarea"
      placeholder="请输入内容~"
      :disabled="!inputtable"
      ref="inputRef"
      @keydown.alt.up="prev_send"
      @keydown.alt.down="next_send"
      @keydown.ctrl.enter="onCtrlEnter"
    />
    <div class="footer-btns">
      <div class="f-b-l"></div>
      <div class="f-b-r">
        <el-tooltip >
          <template #content>
            <div class="tips-content">
              <div>
                <span class="key-bar">cmd/ctrl</span> + <span class="key-bar">enter</span> &nbsp; 发送
              </div>
              <div>
                <span class="key-bar">alt</span> + <span class="key-bar">up</span> &nbsp; 上一条
              </div>
              <div>
                <span class="key-bar">alt</span> + <span class="key-bar">down</span> &nbsp; 下一条
              </div>
            </div>
          </template>
          <el-icon class="question-b">
            <QuestionFilled />
          </el-icon>
        </el-tooltip>

        <el-popconfirm
          width="220"
          confirm-button-text="确认"
          cancel-button-text="取消"
          :icon="InfoFilled"
          title="清空后不可恢复，确认吗?"
          @confirm="clearBySession"
        >
          <template #reference>
            <el-button plain :icon="Delete" :disabled="!inputtable">清空对话</el-button>
          </template>
        </el-popconfirm>

        <el-button type="primary" :icon="Promotion" @click="onCtrlEnter" :disabled="!inputtable"
          >发送(cmd/ctrl + Enter)</el-button
        >
      </div>
    </div>

    <el-button
      id="stop-out"
      type="danger"
      plain
      :icon="CircleClose"
      @click="stopOut"
      v-if="!inputtable"
      >终止输出</el-button
    >
  </div>
</template>
<script setup>
import { ref, watch,onMounted } from 'vue'
import { Promotion, Delete, CircleClose, InfoFilled, QuestionFilled } from '@element-plus/icons-vue'
const props = defineProps({
  inputtable: Boolean,
  send: Function,
  clearBySession: Function,
  stopOut: Function
})

const inputText = ref('')
const inputRef = ref()
let send_history = []




watch(inputText, (newValue, oldValue) => {})

const input = document.getElementById("input");
let history_index = 1
const prev_send = (e) => {
  if (send_history.length > 0 && send_history.length >= history_index) {
    inputText.value = send_history[send_history.length - history_index]
    history_index++
    inputRef.value.focus(inputText.value.length,inputText.value.length)
  }
}
const next_send = (e) => {
  if (send_history.length > 0 && history_index > 1) {
    history_index--
    inputText.value = send_history[send_history.length - history_index]
    inputRef.value.focus(inputText.value.length,inputText.value.length)
  }
}

const onCtrlEnter = () => {
  if (inputText.value) {
    props.inputtable = false
    props.send(inputText.value)
  }
}
const sendOver = () => {
  send_history.push(inputText.value)
  history_index = 1
  inputText.value = ''
  props.inputtable = true
  inputRef.value.focus()
}

//暴露
defineExpose({
  sendOver
})
</script>
<style scoped>
.footer {
  width: 100%;
  height: 100%;
  padding: 10px 5px;
  box-sizing: border-box;
  position: relative;
}
.footer-btns {
  line-height: 50px;
  display: flex;
}
.footer-btns .f-b-l,
.footer-btns .f-b-r {
  width: 50%;
  height: 100%;
}
.footer-btns .f-b-r {
  text-align: right;
}
#stop-out {
  position: absolute;
  right: 10px;
  top: -25px;
}
.question-b {
  vertical-align: middle;
  margin: 0 10px;
}

.dark .key-bar{
  border: 1px solid var(--el-color-primary);
  color: var(--el-color-primary);
}
.key-bar {
  display: inline-block;
  padding: 0 5px;
  border: 1px solid #fff;
  color: #fff;
  border-radius: 5px;
}
.tips-content>div{
  padding: 5px 0;
}

</style>
