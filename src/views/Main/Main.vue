<template lang="pug">
NavBar(:is-parent-level='Object.keys(route.query).length === 0' style='z-index: 2;background-color: var(--app-nav-bg-color);')
    ul.inline-vertical-middle(@click='bypassSameRoute')
        li.showOnTablet
            router-link(to="/" tag="li")
                img(src="@/assets/img/logo-small.svg" style="width: 40px; height: 40px;")
        li
            router-link(to="/docs") Documentation

        li(v-if='state.user')
            router-link(to="/dashboard") Dashboard

        template(v-if='state.connection')

            template(v-if='state.user')
                li
                    router-link(to="/account-settings") Account Settings

                li
                    a.clickable(@click='()=>skapi.AdminLogout().then(() => state.user = null)') Logout

            template(v-else)
                li
                    router-link(to="/dashboard") Dashboard

                li.showOnTablet
                    router-link(to="/signup") Sign-up

                li.hideOnTablet
                    sui-button.signup(@click="()=>router.push('/signup')" style="padding: 12px 16px") Sign-up

main(v-if="state.user")
    router-view
sui-overlay(v-else-if="state.viewport !== 'mobile'" ref="overlay" style="background: rgba(0, 0, 0, 0.6);")
    Login
Login(v-else)
</template>
<style lang="less" scoped>
@import '@/assets/variables.less';
sui-button.signup {
    background-color: #fff;
    color: var(--primary-color);
    height: 30px;
}
</style>

<script setup>
import NavBar from '@/components/navbar.vue';
import { ref, inject, onMounted, onUpdated, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { skapi, state, awaitConnection } from '@/main';

import Login from './Login.vue';
let router = useRouter();
let route = useRoute();
let appStyle = inject('appStyle');
const overlay = ref(null);

function bypassSameRoute(e) {
    // bypass when same route is clicked
    let routeName = {
        'Dashboard': 'dashboard',
        'Login': 'login'
    }[e.target.textContent.trim()];

    if (routeName && route.name !== routeName) {
        e.stopPropagation();
    }
}

onMounted(() => {
    awaitConnection.then(async ()=>{
        await nextTick();
        console.log(state.user);
        if(!state.user && state.viewport === 'desktop') {
            overlay.value.open();
        }
    });
});

onUpdated(() => {
    awaitConnection.then(async ()=>{
        await nextTick();
        console.log(state.user);
        if(!state.user && state.viewport === 'desktop') {
            overlay.value.open();
        }
    });
});
</script>