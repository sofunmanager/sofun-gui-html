<template>
  <el-drawer v-model="drawer" :direction="direction" size="400">
    <template #header>
      <h4>设置</h4>
    </template>
    <template #default>
      <div>
        <el-form :model="form" label-width="100px" label-position="left">
          <el-form-item label="模型">
            <el-select
              v-model="form.model"
              @change="onModelChange"
              size="large"
            >
              <el-option
                v-for="item in gptModels"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="接口类型">
            <el-select
              v-model="form.type"
              @change="onApiEmunChange"
              size="large"
            >
              <el-option
                v-for="(item, key) in apiEmun"
                :key="key"
                :label="item.name"
                :value="key"
              />
            </el-select>
          </el-form-item> -->


          <el-form-item label="API" v-if="!form.openCustom">

            <el-select
              v-model="form.apiUrl"
              size="large"
            >
              <el-option
                v-for="item in apiList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="API" v-if="form.openCustom">
            <el-input
              v-model="form.apiUrl"
              placeholder="Please input api"
              :readonly="!form.apiUrl"
            />
          </el-form-item>

          <el-form-item label="KEY">
            <el-input
              type="password"
              show-password
              v-model="form.aip_key"
              placeholder="Please input api key"
            />
          </el-form-item>

          <el-form-item label="余额" v-if="!form.openCustom">
            <el-input
              v-model="form.balance"
              readonly
            >
              <template #prepend>P</template>
              <template #append>
                <el-button plain type="primary" :icon="Refresh" @click="credit_grants"/>
              </template>
            </el-input>
          </el-form-item>
          

          <el-form-item label="自定义接口">
            <el-switch
              v-model="form.openCustom"
              active-text="开启"
              inactive-text="关闭"
            />
          </el-form-item>

        </el-form>


        

      </div>
    </template>
    <template #footer>
      <div style="margin-bottom:30px">


        
        <el-row style="padding:10px 0;">
          <el-text class="mx-1" type="warning" >
            <el-icon :size="size" :color="color">
              <QuestionFilled />
            </el-icon>
            没有可用的KEY? 
            <el-link type="primary" @click="getKey">获取KEY</el-link>
          </el-text>
          
        </el-row>

        <el-row style="padding:10px 0;">
          <span style="font-size: 14px;padding-right: 10px;">当前版本：v{{currVersion}}</span>
          <el-link type="primary" target="_blank" href="https://gitee.com/sofunmanager/sofun-chat-gpt/tree/master/dist">更多版本</el-link>
        </el-row>

        <el-row style="text-align:center;padding:10px 0;">
          <el-tag  type="danger">该工具仅供学习，禁止商用！</el-tag>
        </el-row>

      </div>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup>
import { version as currVersion } from '../../../../package.json'
import { ref, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Refresh,QuestionFilled } from "@element-plus/icons-vue";
import { toRaw } from "vue";
import { ElLoading, } from 'element-plus'
import axios from "axios";
const drawer = ref(false);
const direction = ref("ltr");

import { getCurrentInstance } from "vue";
let globalProperties = getCurrentInstance()?.appContext.config.globalProperties;
let _global = globalProperties?.$global;

const typeEmun = ref(_global.typeEmun);
const apiUrlList = ref(_global.settings.apiUrl);

const onApiEmunChange = (v) => {};

const gptModels = ref([

  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-16k-0613",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-0125",

  "gpt-4",
  "gpt-4-0613",
  "gpt-4-vision-preview",
  "gpt-4-1106-preview",


]);

const apiList=ref([
    "https://oa.api2d.site",
    "https://oa.api2d.net",
    "https://openai.api2d.net",
    "https://oa.api2d.online",
    "https://stream.api2d.net",
  ],)


const form = reactive({
  balance: -1,
  model: "",
  type: "",
  openCustom: false,
  apiUrl: "",
  aip_key: "",
});

function onModelChange(v) {
  if (v.indexOf("gpt-4") !== -1) {
    ElMessage({
      message: "您选择的是4模型，价格是其他模型的3.5的15~30倍,请谨慎使用！",
      type: "warning",
    });
  }
}

const onApiBlur = () => {
  if (form.openCustom && !form.apiUrl) {
    form.apiUrl = "https://oa.api2d.net";
  }
};

const handleClose = (done) => {};
function cancelClick() {
  drawer.value = false;
}
function save() {
  let data = toRaw(form);
  let settings = _global.settings;
  for (let k in data) {
    settings[k] = data[k];
  }

  window.localStorage.setItem(
    _global.storageKey.SETTINGS,
    JSON.stringify(settings)
  );


}

function submit(){
    save()
    drawer.value = false;
        ElMessage({
        message: "设置成功！",
        type: "success",
    });
}

const openSettings = () => {
  let settings = _global.settings;
  for (let k in settings) {
    form[k] = settings[k];
  }

  if(!settings.openCustom){
    credit_grants()
  }
  
  drawer.value = true;
};

const credit_grants = () => {
    if(!_global.settings.aip_key){
        ElMessage({
            message: "请先获取KEY,在设置项中填写并保存!",
            type: "warning",
        });
        return false;
    }

    var config = {
    method: 'get',
    url: _global.settings.apiUrl+'/dashboard/billing/credit_grants',
    headers: { 
        'Authorization': 'Bearer '+_global.settings.aip_key, 
        // 'User-Agent': 'Apifox/1.0.0 (https://apifox.com)', 
        'Content-Type': 'application/json'
    },
    };
    let loadingInstance=ElLoading.service({ fullscreen: true })
    axios(config) .then(function (response) {
        let res=response.data
        form.balance=res.total_granted
        loadingInstance.close()
        save()
    })
    .catch(function (error) {
        ElMessage({
            message: error,
            type: "error",
        });
        loadingInstance.close()
    });


};


const getKey=()=>{
  let url="https://api2d.com/r/206580"
  window.open(url)
}



//暴露
defineExpose({
  openSettings,
});
</script>