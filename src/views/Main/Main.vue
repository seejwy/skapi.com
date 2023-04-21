<template lang="pug">
NavBar(:is-parent-level='Object.keys(route.query).length === 0' style='z-index: 10;background-color: var(--app-nav-bg-color);')
    ul.inline-vertical-middle(@click='bypassSameRoute')
        li.showOnTablet
            router-link(to="/" tag="li")
                img(src="@/assets/img/logo-small.svg" style="width: 40px; height: 40px;")
        li
                a(href="https://docs.skapi.com" target="_blank") Documentation

        li(v-if='state.user')
            router-link(to="/dashboard") Dashboard

        template(v-if='state.connection')

            template(v-if='state.user')
                li
                    router-link(to="/account-settings") Account Settings

                li
                    a.clickable(@click="logout") Logout

            template(v-else)
                li
                    router-link(to="/dashboard") Login

                li.showOnTablet
                    router-link(to="/signup") Sign-up

                li.hideOnTablet
                    sui-button.signup(@click="()=>router.push('/signup')" style="padding: 12px 16px") Sign-up
main(v-if="route.name === 'home'")
    router-view
main.app(v-if="noLoginNeeded()")
    router-view
main(v-else)
    .wrapper
        Login
</template>
<style lang="less" scoped>
@import '@/assets/variables.less';

@media @tablet_excl {
    main .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 60px 0;
        min-height: calc(100vh - 140px);
    }
}

sui-button.signup {
    background-color: #fff;
    color: var(--primary-color);
    height: 30px;

    &:hover,
    &:focus,
    &:active {
        background-color: #fff;
    }

    &:hover {
        box-shadow: rgba(255, 255, 255, 0.65) 1px 1px 2px inset, rgba(0, 0, 0, 0.25) -1px -1px 2px inset, rgba(0, 0, 0, 0.25) 0px 0px 0px 1px inset, rgba(191, 191, 191, 0.16) 0px 0px 1em 1em inset;
    }

    &:active {
        box-shadow: rgba(128, 128, 128, 0.25) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.75) 0px 1px 3px inset, rgba(255, 255, 255, 0.25) -1px -1px 1px inset;
    }
}
</style>

<script setup>
import NavBar from '@/components/navbar.vue';
import { ref, inject, onMounted, onUpdated, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { skapi, state, logout, awaitConnection } from '@/main';

import Login from './Login.vue';
let router = useRouter();
let route = useRoute();
let appStyle = inject('appStyle');
const overlay = ref(null);

const noLoginNeeded = () => {
    if(!state.user) {
        switch(route.name) {
            case 'forgotpassword':
            case 'signup':
            case 'confirmation':
            case 'success':
            case 'home':
            case 'deleted':
            case 'sample':
                return true;
        }

        return false;
    } else {
        return true;
    }
}

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
</script>