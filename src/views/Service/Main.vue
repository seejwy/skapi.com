<template lang="pug">
.servicePageShell
    .sideScreen
        NavBar(v-if="pageTitle" style='background-color: #505050;z-index: 2;')
            ul.iconText
                li
                    router-link(to="/" tag="li") Documentation

                li
                    router-link(to="/dashboard" tag="li") Dashboard

                li
                    router-link(to="/" tag="li") Account Settings

                li
                    a.clickable(@click='()=>skapi.logout().then(() => state.user = null)') Logout

        main#app-main(v-if='state.connection')
            NotExists(v-if='service === 404')
            template(v-else-if='service')
                router-view

            Login(v-else)
            
            .padBlock.showOnIpad

    .sidebar
        img.logo(src="@/assets/img/logo-small.svg" alt="Skapi")

        router-link(to="/dashboard")
            span.material-symbols-outlined storage

        router-link(:to="{name: 'service'}")
            span.material-symbols-outlined settings

        router-link(to='/')
            //(:to="{name: 'users'}") 
            span.material-symbols-outlined photo_camera_front

        router-link(:to="{name: 'records'}")
            span.material-symbols-outlined folder_copy

        router-link(to='/')
            //(:to="{name: 'mail'}")
            span.material-symbols-outlined mail

</template>
<style lang="less">
@import '@/assets/variables.less';

.servicePageShell {
    display: flex;
    flex-direction: row-reverse;

    @media @ipad {
        display: block;
    }

    // navbar title text
    .titleText {
        color: rgba(255 255 255 / 60%);

        @media @tablet {
            color: inherit;
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
            .padBlock {
                width: 100%;
                height: 120px;
            }
        }
    }
}
</style>

<!-- script below -->
<script setup>
import NavBar from '@/components/navbar.vue';
import NotExists from '@/views/Main/404.vue';
import Login from '../Main/Login.vue';
import { provide, inject, watch, ref } from 'vue';
import { skapi, state } from '@/main';
import { useRoute, useRouter } from 'vue-router';

let router = useRouter();

let appStyle = inject('appStyle');
appStyle.background = '#595959';
appStyle.color = '#fff';

// sets pageTitle for immediate effect
// this does not trigger again when nested routes change
let route = useRoute();
let serviceId = route.params.service;
let service = ref(null);

provide('service', service);
provide('recordTables', ref(null));
provide('fetchingData', ref(false));

let pageTitle = inject('pageTitle');
pageTitle.value = 'Service';

function getServices(gs) {
    if (!(gs instanceof Promise)) {
        return;
    }

    gs.then(services => {
        let region = skapi.region_list?.[serviceId.substring(0, 4)];
        if (!region) {
            // region does not exists
            service.value = 404
            return;
        }

        for (let s of services[region]) {
            console.log(s);
            if (s.service === serviceId) {
                service.value = s;
                return s;
            }
        }

        // no matching service id
        service.value = 404;
    });
}

getServices(state.getServices);

// watch is for users visiting the page directly
watch(() => state.getServices, getServices);
watch(() => state.user, u => {
    if (!u) {
        // throw user to login page if not logged in
        router.replace('/login');
    }
});
</script>