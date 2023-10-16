<template>
    <Home/>
</template>
<script setup>
import Home from "@/views/Home.vue";
// import { version } from '../../../../package.json';



window.addEventListener('contextmenu', ()=>{
	event.preventDefault(); // 阻止右键菜单的弹出
});

</script>
<style scoped>
    


</style>
