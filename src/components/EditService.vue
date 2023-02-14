<template lang="pug">
.overlay-container
    form(@submit.prevent="save")
        .overlay-container-title.hideOnTablet Service Setting
        .toggle
            span Enable/Disable
            .toggle-bar 
                .toggle-ball(@click="toggleService" :class="{'active': service.active > 0}")
        .input
            label Name of Service
            sui-input(type="text" :disabled="isCreatingService ? 'true' : null" placeholder="Name of Service" :value="serviceName" @input="(e) => serviceName = e.target.value" required)
        .input
            label CORS
            sui-input(type="text" :disabled="isCreatingService ? 'true' : null" placeholder="Name of Service" :value="cors" @input="(e) => cors = e.target.value" required)
        .input
            label API Key
            sui-input(type="text" :disabled="isCreatingService ? 'true' : null" placeholder="Name of Service" :value="apiKey" @input="(e) => apiKey = e.target.value" required)
        hr
        div(style="text-align: right; margin-bottom: 40px;")
            sui-button.text-button.delete-button(type="button" @click="deleteService") Delete Service
        sui-button.hideOnTablet(type="submit") Save 
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
const togglePromise = ref(null);

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

const toggleService = async() => {
    if((togglePromise.value instanceof Promise)) return;
    if(service.value.active > 0) {
        togglePromise.value = skapi.disableService(service.value.service).then(() => {
            togglePromise.value = null;
        });
    } else {
        togglePromise.value = skapi.enableService(service.value.service).then(() => {
            togglePromise.value = null;
        });
    }
}

const deleteService = () => {
    skapi.deleteService(service.value.service).then(() => {
        console.lo
        router.replace('/dashboard');
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
.toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 28px;
    font-weight: bold;
    color: rgba(255, 255, 255, .6);

    &-bar {
        position: relative;
        height: 8px;
        width: 40px;
        background: rgba(0, 0, 0, 0.6);
        border: 0.3px solid #595959;
        box-shadow: inset 0.5px 0.5px 1px rgba(0, 0, 0, 0.25);
        border-radius: 2px;
        margin-right: 10px;
    }
    &-ball {
        position: absolute;
        cursor: pointer;
        height: 20px;
        width: 20px;
        left: -10px;
        top: -7px;
        border-radius: 10px;
        background: #D9D9D9;
        border: 0.3px solid #595959;
        box-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.25), inset -0.5px -0.5px 1px rgba(0, 0, 0, 0.25), inset 1px 1px 1px #FFFFFF;
        transition: left .3s ease-in-out, background-color .3s ease-in-out;

        &.active {
            left: calc(100% - 10px);
            background: #5AD858;
        }
    }
}
.delete-button {
    color: rgba(240, 78, 78, 0.85);
}
</style>