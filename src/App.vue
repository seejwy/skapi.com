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
provide('pageTitle', pageTitle);

provide('appColor', {
  get background() {
    document.body.style.getPropertyValue('--app-bg-color');
  },
  set background(v) {
    document.body.style.setProperty('--app-bg-color', v);
  },
  get color() {
    document.body.style.getPropertyValue('--app-color');
  },
  set color(v) {
    document.body.style.setProperty('--app-color', v);
  }
});

</script>