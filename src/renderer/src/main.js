import { createApp } from 'vue'

import App from './App.vue'
import ElementPlus from 'element-plus'
import './style/style.css'
import './style/index.scss'
import './style/dark.scss'
// import 'element-plus/dist/index.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'
// import 'element-plus/theme-chalk/src/dark/css-vars.scss'
//加载全局变量
import _global from "@/store/AppGlobal.vue";


//全局注册页面加载进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const app = createApp(App);
app.config.globalProperties.$global = _global;

// 全局前置守卫
window.addEventListener('beforeunload', function() {
	// 显示页面进度条
	NProgress.start();
	next();
  });


// 全局后置守卫
window.addEventListener('load', function() {
	// 隐藏页面进度条
	NProgress.done();
  });

// import {db} from "@/store/utils.js"



app.use(ElementPlus)
	.mount('#app')
