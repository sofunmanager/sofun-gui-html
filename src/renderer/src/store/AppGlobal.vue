
<script>

const typeEmun = {
  chat: {
    name: "聊天接口 (/v1/chat/completions)",
    url: "/v1/chat/completions",
  },
  completion: {
    name: "内容补全接口 (/v1/completions)",
    url: "/v1/completions",
  },
  edits: { name: "文本编辑接口 (/v1/edits)", url: "/v1/edits" },
  images: {
    name: "图片生成接口 (/v1/images/generations)",
    url: "/v1/images/generations",
  },
};

const settings = {
  balance: -1,
  model: "gpt-3.5-turbo",
  type: "chat",
  openCustom: false,
  apiUrl: "https://oa.api2d.site",
  aip_key: "",
};


const storageKey={
  SE_LIST:"_sofun_sesstion_list",
  SE:"_sofun_session_",
  SETTINGS:"_sofun_settings",
  ACTIVE_TAB:"_sofun_active_tab",
  NEW_VERSION:"_sofun_new_version"
}


let local_settings=window.localStorage.getItem(storageKey.SETTINGS)
local_settings=local_settings&&JSON.parse(local_settings)
for(let k in local_settings){
  settings[k]=local_settings[k]
}


export default {
  typeEmun,
  settings,
  storageKey
};
</script>

