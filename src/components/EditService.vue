<template lang="pug">
.overlay-container
    form(@submit.prevent="save")
        .overlay-container-title.hideOnTablet Service Setting
        .input
            label Name of Service
            sui-input(type="text" :disabled="isCreatingService ? 'true' : null" placeholder="Name of Service" :value="serviceName" @input="(e) => serviceName = e.target.value" required)
        .input
            label CORS
            sui-input(type="text" :disabled="isCreatingService ? 'true' : null" placeholder="Name of Service" :value="cors" @input="(e) => cors = e.target.value" required)
        .input
            label API Key
            sui-input(type="text" :disabled="isCreatingService ? 'true' : null" placeholder="Name of Service" :value="apiKey" @input="(e) => apiKey = e.target.value" required)
        sui-button(type="submit") Save 
</template>
<!-- script below -->
<script setup>
import { inject, ref, watch, onBeforeUnmount } from 'vue';
import { state, skapi } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from './Icon.vue';

let route = useRoute();
let router = useRouter();
const isCreatingService = ref(false);
let appStyle = inject('appStyle');
let pageTitle = inject('pageTitle');
let service = inject('service');
let navbarMobileRightButton = inject('navbarMobileRightButton');
let navbarBackDestination = inject('navbarBackDestination');
const serviceName = ref('');
const cors = ref('');
const apiKey = ref('');

serviceName.value = service.value.name;
cors.value = service.value.cors;
apiKey.value = service.value.api_key;

const buttonCallback = async () => {
    navbarMobileRightButton.value = {
        type: 'icon',
        val: 'loading',
        cssClass: 'animation-rotation--slow-in-out'
    };
    try {
        await save();
    } finally {
        navbarMobileRightButton.value = {
            type: 'text',
            val: 'SAVE',
            callback: buttonCallback
        };
    }
}

const save = () => {
    return skapi.updateService(service.value.service, {
        name: serviceName.value,
        cors: cors.value,
        api_key: apiKey.value
    });
}

if(state.viewport === 'mobile') {
    pageTitle.value = 'Service Setting'
    appStyle.navBackground = '#505050';
    appStyle.background = '#333333';
    navbarBackDestination.value = function() {
        router.push(`/dashboard/${service.value.service}`);
    }

    navbarMobileRightButton.value = {
        type: 'text',
        val: 'SAVE',
        callback: buttonCallback
    };
}

watch(() => state.viewport, (viewport) => {
    if(viewport === 'desktop') {
        router.replace({query: null});
    }
})

onBeforeUnmount(() => {
    appStyle.background = '#595959';
    appStyle.navBackground = '#293fe6';
    pageTitle.value = 'skapi';
    navbarMobileRightButton.value = null;
});
</script>

<style lang="less" scoped>
@import '@/assets/variables.less';
.overlay-container {
    background-color: #505050;
    border: 1px solid #808080;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
    color: #fff;
    text-align: center;
    padding: 40px;
    width: 500px;
    max-width: 100%;
    border-radius: 8px;

    &-title {
        font-weight: bold;
        font-size: 28px;
    }

    .input {
        margin: 20px auto;

        label {
            display: block;
            text-align: left;
            font-weight: bold;
            color: rgba(255, 255, 255, .6);
            margin-bottom: 8px;
        }
        sui-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25), inset 1px 1px 1px rgba(0, 0, 0, 0.5);
            border-radius: 5px;
        }
    }
    @media @tablet {
        width: 100%;
        max-width: unset;
        border-radius: 0;
        border: none;
        box-shadow: none;
        background: transparent;
        padding: 0;
    }
}
</style>