<template>
  <div class="footer">
    <el-input
      v-model="inputText"
      :rows="5"
      resize="none"
      type="textarea"
      placeholder="请输入内容~"
      :disabled="!inputtable"
      @keydown.ctrl.enter="onCtrlEnter"
    />
    <div class="footer-btns">
      <div class="f-b-l">
        <el-popconfirm
          width="220"
          confirm-button-text="确认"
          cancel-button-text="取消"
          :icon="InfoFilled"
          title="清空后不可恢复，确认吗?"
          @confirm="clearBySession"
        >
          <template #reference>
            <el-button plain :icon="Delete" >清空对话</el-button>
          </template>
        </el-popconfirm>
        <el-button type="danger" plain :icon="CircleClose" @click="stopOut">终止输出</el-button>
      </div>
      <div class="f-b-r">
        <el-button
        type="primary"
        :icon="Promotion"
        @click="onCtrlEnter"
        :disabled="!inputtable"
        >发送(cmd/ctrl + Enter)</el-button
      >
      </div>
      


    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { Promotion ,Delete,CircleClose,InfoFilled} from "@element-plus/icons-vue";
const props = defineProps({
  inputtable: Boolean,
  send: Function,
  clearBySession: Function,
  stopOut: Function,
});

const inputText = ref("");

const onCtrlEnter = () => {
  if (inputText.value) {
    props.inputtable = false;
    props.send(inputText.value);
  }
};
const sendOver = () => {
  inputText.value = "";
  props.inputtable = true;
};

//暴露
defineExpose({
  sendOver,
});
</script>
<style scoped>
.footer {
  width: 100%;
  height: 100%;
  padding: 10px 5px;
  box-sizing: border-box;
}
.footer-btns {

  line-height: 50px;
  display: flex;
}
.footer-btns .f-b-l,.footer-btns .f-b-r{
  width: 50%;
  height: 100%;
}
.footer-btns .f-b-r{
  text-align: right;
}


</style>
