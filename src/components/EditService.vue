<template lang="pug">
.overlay-container(v-if="service")
    form(@submit.prevent="save" @keydown.enter.prevent="" action="")
        .overlay-container-title.hideOnTablet Service Setting
        .toggle(style="margin-bottom: 40px")
            span Enable/Disable
            .toggle-bar 
                .toggle-ball(@click="toggle" :class="{'active': serviceStatus > 0 }")
        .input
            label Name of Service
            sui-input(type="text" :disabled="promiseRunning ? 'true' : null" placeholder="Name of Service" :value="serviceName" @input="(e) => serviceName = e.target.value" required)
        .input
            label CORS
            sui-input(type="text" :disabled="promiseRunning ? 'true' : null" :value="cors" @input="(e) => cors = e.target.value" required @change="validateCors")
        .input(style="margin-bottom: 40px;")
            label API Key
            sui-input(type="text" :disabled="promiseRunning ? 'true' : null" :value="apiKey" @input="(e) => apiKey = e.target.value")
        sui-button.line-button(v-if="state.viewport !== 'mobile'" type="button" style="margin-right: 16px;" @click="() => {if(!promiseRunning) { emit('close', ''); }}") Cancel
        SubmitButton(v-if="state.viewport !== 'mobile'" :loading="promiseRunning" :disabled="!state.user.email_verified || null") Save
sui-overlay(ref="disableConfirmOverlay")
    .popup
        .title
            Icon warning
            div(v-if="service?.active > 0") Disabling Service?
            div(v-else) Enabling Service?
        .body 
            p(v-if="service?.active > 0") Your service will go offline if you disable "{{ service.name }}"? #[br] Do you wish to continue?
            p(v-else) Your service will be resumed if you enable "{{ service.name }}"? #[br] Do you wish to continue?
        .foot
            sui-button No 
            sui-button.line-button Yes
sui-overlay(ref="disableErrorOverlay")
    .popup
        .title
            Icon warning
            div Something went wrong!
        .body {{ errorMessage }}
        .foot
            sui-button(@click="()=> { disableErrorOverlay.close(); promiseRunning = false; }") Ok
</template>
<!-- script below -->
<script setup>
import { inject, ref, watch, onBeforeUnmount } from 'vue';
import { state, skapi } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from './Icon.vue';
import SubmitButton from './SubmitButton.vue';
import { checkCompatEnabled } from '@vue/compiler-core';

const emit = defineEmits(['close']);

let route = useRoute();
let router = useRouter();
let appStyle = inject('appStyle');
let pageTitle = inject('pageTitle');
let service = inject('service');
let navbarMobileRightButton = inject('navbarMobileRightButton');
let navbarBackDestination = inject('navbarBackDestination');
const serviceStatus = ref(0);
const serviceName = ref('');
const cors = ref('');
const apiKey = ref('');
const promiseRunning = ref(false);
const disableConfirmOverlay = ref(null);
const errorMessage = ref('');
const disableErrorOverlay = ref(null);

serviceName.value = service.value.name;
cors.value = service.value.cors;
apiKey.value = service.value.api_key;
serviceStatus.value = service.value.active;

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
            val: 'Save',
            callback: buttonCallback
        };
    }
}

const validateCors = (event) => {
    let isValid = true;
    cors.value.split(',').forEach(url => {
        if(!skapi.validate.url(url.trim())) {
            isValid = false;
        }
    });

    if(isValid) {
		event.target.setCustomValidity('');
    } else {
		event.target.setCustomValidity('Invalid CORS');
		event.target.reportValidity();
    }
}

const save = async () => {
    if(promiseRunning.value) return;
    if(
        service.value.active === serviceStatus.value &&
        service.value.name === serviceName.value &&
        service.value.cors === cors.value &&
        service.value.api_key === apiKey.value
    ) {
        emit('close', '');
        return;
    }
    if(serviceStatus.value !== service.value.active) {
        try {
            await toggleService();
        } catch(e) {
            promiseRunning.value = false;
            return false;
        }
    }
    await saveFunction();
    promiseRunning.value = false;
    
}

const saveFunction = async () => {
    let res;
    promiseRunning.value = true;

    try {
        res = await skapi.updateService(service.value.service, {
            name: serviceName.value,
            cors: cors.value,
            api_key: apiKey.value
        });
    } catch(e) {
        throw e;
    } finally {
        service.value.name = serviceName.value;
        service.value.cors = cors.value;
        service.value.api_key = apiKey.value;

        emit('close', '');
    }
    return res;
}

const toggle = () => {
    if(promiseRunning.value) return;
    serviceStatus.value > 0 ? serviceStatus.value = 0 : serviceStatus.value = 1;
}
const toggleService = async() => {
    return new Promise((res, rej) => {
        disableConfirmOverlay.value.open();
        const noButton = disableConfirmOverlay.value.querySelectorAll('sui-button')[0];
        const yesButton = disableConfirmOverlay.value.querySelectorAll('sui-button')[1];

        noButton.addEventListener('click', () => {
            disableConfirmOverlay.value.close();
            rej();
        });

        yesButton.addEventListener('click', async () => {    
            promiseRunning.value = true;
            disableConfirmOverlay.value.close();
            let oldStatus = service.value.active === 0 ? 0 : 1;
            try {
                if(service.value.active > 0) {
                    await skapi.disableService(service.value.service);
                } else {
                    service.value.active = 1;
                    await skapi.enableService(service.value.service);
                }
                res();
            } catch(e) {
                service.value.active = oldStatus;
                errorMessage.value = "Unable to toggle service status at this point.";
                disableErrorOverlay.value.open();
                console.error(e);
            }
        });

    });
}

if(state.viewport === 'mobile') {
    pageTitle.value = 'Service Setting'
    appStyle.background = '#333333';
    appStyle.navBackground = '#505050';
    navbarBackDestination.value = function() {
        router.push(`/dashboard/${service.value.service}`);
    }

    navbarMobileRightButton.value = {
        type: 'text',
        val: 'Save',
        callback: buttonCallback
    };
}

watch(() => state.viewport, (viewport) => {
    if(viewport === 'desktop') {
        router.replace({query: null});
    }
})

onBeforeUnmount(() => {
    appStyle.background = null;
    appStyle.navBackground = '#293fe6';
    pageTitle.value = `Service "${service.value.name}"`;
    navbarMobileRightButton.value = null;
    navbarBackDestination.value = null;
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
        margin-bottom: 40px;
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
        margin-top: var(--head-space);
    }
}
.toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    padding: 0;
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.85);

    &:hover {
        background-color: transparent;
    }
}

hr {
    opacity: 8%;
}
</style>