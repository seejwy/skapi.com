<template lang="pug">
div(v-if='!state?.connection')
    // is loading...
div(v-else-if="state?.user")
    .page-header.head-space-helper
        h1 Account Settings

    .settings
        .title Name
        .value(v-if="state.viewport === 'desktop'") {{  state.user.name }}
        .actions
            Icon pencil 
            span.hideOnTablet Edit
        .mobile-value(v-if="state.viewport === 'mobile'") {{  state.user.name }}
        hr
        .title Email
        .value(v-if="state.viewport === 'desktop'") {{  state.user.name }}
        .actions
            sui-button.line-button Change Email
        .mobile-value(v-if="state.viewport === 'mobile'") {{  state.user.name }}
        hr   
        .title Subscription
        .value(v-if="state.viewport === 'desktop'") {{  state.user.name }}
        .actions
            Icon pencil 
            span.hideOnTablet Edit
        .mobile-value(v-if="state.viewport === 'mobile'") {{  state.user.name }}
        hr
        .title Password
        .value(v-if="state.viewport === 'desktop'") {{  state.user.name }}
        .actions
            sui-button.line-button Change Password
        .mobile-value(v-if="state.viewport === 'mobile'") {{  state.user.name }}
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

.page-header {
    @media @tablet {
        text-align: center;
    }

    h1 {
        display: block;
    }
}
.settings {
    display: grid;
    grid-template-columns: auto 1fr 1fr ;
    align-items: center;
    column-gap: 80px;

    & > .title {
        font-weight: bold;
        padding: 28px 0;
    }

    .actions {
        justify-self: end;
        color: var(--primary-color);
        cursor: pointer;

        .line-button {
            color: var(--primary-color);
            white-space: nowrap;
        }
    }

    hr {    
        grid-column: span 3;
        width: 100%;
        border: 1px solid rgba(0, 0, 0, 0.04);
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.06);
    }
    @media @tablet {
        grid-template-columns: auto 1fr ;
        column-gap: 0;

        & > .title {
            height: auto;
            .actions {
                display: block;
            }
        }

        .mobile-value {
            grid-column: span 2;
            padding-bottom: 28px;
        }
        

        hr {    
            grid-column: span 2;
            margin:  0 -16px;
            width: 100vw;
        }
    }
    @media @phone {
        hr {
            margin: 0 -8px;
        }
    }
}
</style>
