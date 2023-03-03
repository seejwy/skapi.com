<template lang="pug">
.servicePageShell
    .sideScreen
        NavBar(v-if="pageTitle" style='background-color: #505050;z-index: 2;')
            ul.inline-vertical-middle
                li
                    router-link(to="/" tag="li") Documentation

                li
                    router-link(to="/dashboard" tag="li") Dashboard

                li
                    router-link(to="/account-settings" tag="li") Account Settings

                li
                    a.clickable(@click='()=>skapi.AdminLogout().then(() => state.user = null)') Logout

        main#app-main(v-if='state.connection')
            NotExists(v-if='service === 404')
            template(v-else-if='service')
                router-view

            sui-overlay(v-else-if="state.viewport !== 'mobile'" ref="overlay" style="background: rgba(0, 0, 0, 0.6);")
                Login
            Login(v-else-if="!state.user")
    .sidebar(v-if="state.user")
        img.logo(src="@/assets/img/logo-small.svg" alt="Skapi")

        router-link(:to="{name: 'service'}")
            Icon home

        router-link(:to="{name: 'users'}") 
            Icon users

        router-link(:to="{name: 'records'}")
            Icon folder_open

        //- router-link(to='/')
            //(:to="{name: 'mail'}")
            //- Icon mail
//- Transition(name="toast")
//-     .toast(v-if="state.user && !state.user.email_verified && state.showVerificationNotification")
//-         Icon warning_bell
//-         .title Email Verfication is Needed
//-         div
//-         .body Please verify your email to prevent your services from shutting down.
//-         Icon.close(@click="state.showVerificationNotification = false") X2
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

        @media @tablet {        
            box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.25);
        }

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
            color: #fff;
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
                margin: 12px 16px;
            }
            
            border-radius: 4px;

            &.router-link-exact-active,
            &:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            svg {
                margin: 6px;
            }
        }
    }

    .sideScreen {
        flex-grow: 1;
    }
}
</style>
<script setup>
import NavBar from '@/components/navbar.vue';
import NotExists from '@/views/Main/404.vue';
import Login from '../Main/Login.vue';
import Icon from '@/components/Icon.vue';

import { provide, inject, watch, ref, onMounted, onBeforeUnmount } from 'vue';
import { skapi, state, log, awaitConnection } from '@/main';
import { useRoute, useRouter } from 'vue-router';
import { recordTables } from './Records/records.js';

let router = useRouter();

// sets pageTitle for immediate effect
// this does not trigger again when nested routes change
let route = useRoute();
let serviceId = route.params.service;
let service = ref(null);

provide('service', service);
provide('serviceUsers', ref(null));
provide('fetchingData', ref(false));

let pageTitle = inject('pageTitle');
pageTitle.value = 'Service';

let overlay = ref(null);

onMounted(() => {
    awaitConnection.then(()=>{
        if(!state.user && state.viewport === 'desktop') {
            overlay.value.open();
        }
        recordTables.value = null;
    });
});

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
        if(services[region]) {
            for (let s of services[region]) {
                if (s.service === serviceId) {
                    service.value = s;
                    return s;
                }
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
        router.push('/');
    }
});

document.body.classList.add('dashboard');
onBeforeUnmount(() => {
    document.body.classList.remove('dashboard');
})
</script>