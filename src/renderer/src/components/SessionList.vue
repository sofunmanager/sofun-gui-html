<template>
  <div class="content">
    <ul id="session-list" ref="sessionList">
      <li
        v-for="(item, index) in list"
        :key="item"
        class="msg-row"
        :class="'msg-row-' + item.role"
        
      >
        <el-popover
          :placement="(item.role==='user'?'left-end':'right-end')"
          :width="170"
          trigger="hover"
        >
          <template #reference>
            <div class="msg-item" :class="'msg-item-' + item.role">
              <div
                v-if="
                  item.role === 'assistant' &&
                  loading &&
                  index === list.length - 1
                "
              >
                <el-icon class="is-loading" style="display: block">
                  <Loading />
                </el-icon>
                <div v-html="formatContent(item.content)"></div>
              </div>
              <div v-else v-html="formatContent(item.content)"></div>
            </div>
          </template>
          <el-button type="primary" plain size="small" 
          :icon="CopyDocument"
          @click="copyItem(item)">复制</el-button>
          <el-button type="danger" plain size="small" 
          :icon="Delete"
          @click="removeItem(item)">移除</el-button
          >
        </el-popover>
      </li>
    </ul>
    <Footer :send="send"
    :clearBySession="clearBySession"
    :stopOut="stopOut"
    :inputtable="!loading"
    ref="footerRef"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick,watch } from "vue";
import Footer from "@/components/root/Footer.vue";
import { getCurrentInstance } from "vue";
import { Loading,CopyDocument, Delete } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";
import Api2d from "api2d";

// import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/prism.js";
/* 引入行号插件，对应的js和css都要引入, 然后在code或pre上添加line-numbers这个类名就行了 */
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

import "prismjs/plugins/toolbar/prism-toolbar.js";
import "prismjs/plugins/toolbar/prism-toolbar.css";

import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js";

import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-c";

let globalProperties = getCurrentInstance()?.appContext.config.globalProperties;
let _global = globalProperties?.$global;

const props = defineProps({
  sesstionId: String,
  rename: Function,
});

const loading = ref(false);
const sessionList = ref(null);
let arr = window.localStorage.getItem(_global.storageKey.SE + props.sesstionId);

const list = ref([]);
let localList = window.localStorage.getItem(
  _global.storageKey.SE + "_" + props.sesstionId
);

if (localList) {
  list.value = JSON.parse(localList);
}

const footerRef = ref(null);


onMounted(() => {
  maxScroll();
  highlightAll()
});




const send = (text) => {
  sendGPT(text);
  
};

let api;
function sendGPT(text) {
  api = new Api2d(_global.settings.aip_key, _global.settings.apiUrl);
  if (list.value.length <= 0) {
    let tit = text;
    if (tit.length > 10) {
      tit = tit.substring(10);
    }
    props.rename(props.sesstionId, tit);
  }
  list.value.push({
    role: "user",
    content: text,
  });

  let requestData = list.value;

  list.value.push({
    role: "assistant",
    content: "",
  });
  loading.value = true;
  maxScroll();
  api
    .completion({
      model: _global.settings.model,
      messages: requestData,
      stream: true,
      onMessage: (string) => {
        pushMsg(string);
      },
      onEnd: (string) => {
        pushMsg(string);
        loading.value = false;
        save();
        footerRef.value.sendOver();
      },
    })
    .catch((e) => {
      let msg=e.message;
      if(msg.indexOf("Unauthorized.0 no forward key")!==-1){
        ElMessage({
            message: "请在设置中填写KEY后再使用！",
            type: "warning",
        });
      }else{
        ElMessage({
          message: `请求出错[${e.message}],开启一个新的会话试试~`,
          type: "error",
        });
      }

      api.abort(); // 主动取消请求
      list.value.pop();
      loading.value = false;

    });


  api.setTimeout(1000 * 20);
  
  function pushMsg(msg) {
    let msgObj = {
      role: "assistant",
      content: msg,
    };
    list.value[list.value.length - 1] = msgObj;
    highlightAll()
    maxScroll();
  }
}



function save() {
  window.localStorage.setItem(
    _global.storageKey.SE + "_" + props.sesstionId,
    JSON.stringify(list.value)
  );
}


function maxScroll() {
  sessionList.value.scrollTop = sessionList.value.scrollHeight;
}

function formatContent(str) {
  //   const regex = /```([\s\S]*?)```/g;
  const regex1 = /```([\s\S]*?)```|```([\s\S]+)/g;
  const match = str.match(regex1);
  if (match) {
    match.forEach((e) => {
      let language = e.substring(3, e.indexOf("\n"));
      let newCode = e;
      newCode = e.replace(language, "");
      newCode = newCode.replace(/```/g, "");
      newCode = newCode.replace(/</g, "&lt;");
      newCode = newCode.replace(/>/g, "&gt;");


      //此处code换行会导致行号错位（离谱bug！！！！）
      let template=`
          <pre class="language-${language}"><code class="line-numbers" class="line-numbers" data-prismjs-copy="复制代码" data-prismjs-copy-success="复制成功" data-prismjs-copy-timeout="1000">
            ${newCode}
            </code>
            </pre>
      `
      str = str.replace(e,template);


    });
  }
  return str;
}


const highlightAll=()=>{
  nextTick(() => {
    Prism.highlightAll();
  });
}

const clearBySession = () => {
  list.value = [];
  save();
};
const stopOut = () => {
  console.log("stopOut...");
  api.abort(); // 主动取消请求
  loading.value = false;
  save();
  window.location.reload();
};
function copyToClipboard(text) {
  var textarea = document.createElement("textarea");
  textarea.value = text;

  // 将textarea元素添加到DOM中
  document.body.appendChild(textarea);

  // 选中textarea中的文本
  textarea.select();

  // 执行复制命令
  document.execCommand('copy');

  // 删除textarea元素
  document.body.removeChild(textarea);
}
const copyItem=(item)=>{
  copyToClipboard(item.content);
  ElMessage({
        message: "已复制到粘贴板",
        type: "info",
  })
}
const removeItem=(item)=>{
  list.value = list.value.filter(obj => obj.role !== item.role || obj.content !== item.content);
  save()
}


</script>



<style scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
#session-list {
  width: 100%;
  height: calc(100% - 170px);
  max-width: 100%;
  overflow-y: auto;
}
.footer {
  width: 100%;
  height: 170px;
}
.msg-row {
  margin: 10px 15px;
  font-size: 15px;
}
.msg-row-assistant {
  text-align: left;
}
.msg-row-user {
  text-align: right;
}

.msg-item {
  padding: 10px;
  box-sizing: border-box;
  display: inline-block;
  max-width: 80%;
  line-height: 26px;
  border-radius: 5px;
  position: relative;
  text-align: left;
}
.msg-item * {
  user-select: text !important;
}
::v-deep .msg-item code,
::v-deep .msg-item code[class*="language-"],
::v-deep .msg-item code[class*="language-"] * {
  user-select: text !important;
}
.msg-item::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  top: 17px;
  transform: rotate(45deg);
}
.msg-item-user {
  background: var(--el-color-primary-light-8);
  /*border-radius:5px 0 5px 5px;*/
}
.msg-item-user::before {
  background: var(--el-color-primary-light-8);
  right: -5px;
}

.msg-item-assistant {
  background: var(--el-color-primary-light-5);
  /*border-radius:0 5px 5px 5px;*/
}
.msg-item-assistant::before {
  background: var(--el-color-primary-light-5);
  left: -5px;
}
</style>