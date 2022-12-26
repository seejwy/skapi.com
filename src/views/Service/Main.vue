<template lang="pug">
.shell
    .sideScreen
        NavBar
            ul.iconText
                li
                    router-link(to="/dashboard" tag="li") Dashboard
                li
                    router-link(to="/" tag="li") Documentation
                li
                    router-link(to="/" tag="li") Account Settings
                li
                    router-link(to="/" tag="li") Logout
        main
            router-view
            .padBlock.onlyOnTablet

    .sidebar
        router-link(to="/", custom, v-slot="{ navigate, href }")
            img.logo(
                src="@/assets/img/logo-small.svg",
                @click="navigate",
                :href="href",
                alt="Skapi",
            )
        router-link(to="/dashboard") 
            span.material-symbols-outlined storage
        //- router-link(:to="{name: 'setting'}") 
        //-     span.material-symbols-outlined settings
        router-link(to="/users") 
            span.material-symbols-outlined photo_camera_front
        router-link(:to="{name: 'records'}")
            span.material-symbols-outlined folder_copy
        router-link(to="/mails") 
            span.material-symbols-outlined mail

</template>
<style lang="less" scoped>
@import '@/assets/variables.less';

.shell {
    display: flex;
    flex-direction: row-reverse;

    @media @ipad {
        display: block;
    }
}

.sidebar {
    background: var(--primary-color);

    @media @ipad {
        height: unset;
        width: 100%;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        min-height: unset;
        flex-wrap: wrap;
        bottom: 0px;
        position: fixed;
        top: unset;
    }

    height: 100%;
    min-height: 100vh;
    width: 52px;
    position: sticky;
    top: 0;

    &>* {
        display: inline-block;
    }

    & .logo {
        display: block;
        width: 32px;
        margin: 14px 10px;

        @media @ipad {
            display: none;
        }
    }

    &>a {
        display: block;
        margin: 28px 8px;

        @media @ipad {
            width: 36px;
            height: 36px;
            border-radius: 4px;
            margin: 12px 16px;
        }

        &.router-link-exact-active,
        &:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        & span {
            display: inline-block;
            font-size: 24px;
            color: #fff;
            margin: 6px;
        }
    }
}

.sideScreen {
    flex-grow: 1;

    main {
        max-width: 1000px;
        margin: auto;

        .padBlock {
            width: 100%;
            height: 120px;
        }
    }
}
</style>
<!-- script below -->
<script setup>
import NavBar from '@/components/navbar.vue';
import { inject } from 'vue';
import { useRoute } from 'vue-router';
let route = useRoute();

let pageTitle = inject('pageTitle');
pageTitle.value = route.params.service;

let appColor = inject('appColor');
appColor.background = '#595959';
appColor.color = '#fff';
</script>