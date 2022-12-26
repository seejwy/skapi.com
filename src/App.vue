<template lang="pug">
router-view
</template>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
}

</style>
<!-- script below -->
<script setup>
import { provide, ref } from 'vue';

let pageTitle = ref('skapi');
provide('pageTitle', pageTitle)

</script>