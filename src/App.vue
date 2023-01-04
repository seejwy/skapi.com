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
import { state } from '@/main';
let pageTitle = ref('skapi');
provide('pageTitle', pageTitle);
provide('navbarBackDestination', ref(null));

let viewport = ref(state.viewport);
provide('viewport', viewport);
state.viewportOnChange = v => {
  viewport.value = v;
};

provide('appStyle', {
  get background() {
    return document.body.style.getPropertyValue('--app-bg-color');
  },
  set background(v) {
    document.body.style.setProperty('--app-bg-color', v);
  },
  get color() {
    return document.body.style.getPropertyValue('--app-color');
  },
  set color(v) {
    document.body.style.setProperty('--app-color', v);
  },
  get mainPadding() {
    return document.getElementById('app-main').style.padding;
  },
  set mainPadding(v) {
    document.getElementById('app-main').style.padding = v;
  }
});

</script>