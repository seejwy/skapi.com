<template lang="pug">
div(v-if='!state?.connection')
    // is loading...
div(v-else-if="state?.user")
    h1 Account Settings
    Transition(name="toast")
        .toast(v-if="state.user && !state.user.email_verified && state.showVerificationNotification")
            Icon warning_bell
            .title Email Verfication is Needed
            div
            .body Please verify your email to prevent your services from shutting down.
            Icon.close(@click="state.showVerificationNotification = false") X2
sui-overlay(v-else-if="state.viewport !== 'mobile'" ref="overlay" style="background: rgba(0, 0, 0, 0.6);")
    Login
Login(v-else)
</template>
<script setup>
import { inject, ref, onUpdated } from 'vue';
import { state, awaitConnection } from '@/main';
import Login from './Login.vue';
import { useRoute, useRouter } from 'vue-router';

import Icon from '@/components/Icon.vue';

let router = useRouter();
let route = useRoute();

let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

let serviceList = ref(null);
let overlay;
onUpdated(() => {
    awaitConnection.then(()=>{
        if(!state.user && state.viewport === 'desktop') {
            overlay.open();
        }
    });
});
</script>

<style lang="less" scoped>
@import '@/assets/variables.less';
</style>
