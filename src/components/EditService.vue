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
            sui-button.text-button.delete-button(type="button" @click="deleteServiceAsk") Delete Service
        sui-button.hideOnTablet(type="submit") Save
sui-overlay(ref="deleteConfirmOverlay")
    .popup
        .title
            Icon warning
            div Deleting Service?
        .body 
            p Are you sure you want to delete "{{ service.name }}" permanently? #[br] You will not be able to undo this action.
            p To confirm deletion, enter Service ID #[br] #[span(style="font-weight: bold") {{ service.service }}]
            sui-input(:placeholder="service.service" :value="confirmationCode" @input="(e) => confirmationCode = e.target.value")

        .foot
            sui-button(@click="()=> { deleteConfirmOverlay.close(); promiseRunning = false; }") No 
            sui-button.line-button(@click="deleteService") Yes

sui-overlay(ref="deleteErrorOverlay")
    .popup
        .title
            Icon warning
            div Something went wrong!
        .body {{ errorMessage }}
        .foot
            sui-button(@click="()=> { deleteErrorOverlay.close(); promiseRunning = false; }") Ok
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
const promiseRunning = ref(false);
const deleteConfirmOverlay = ref(null);
const confirmationCode = ref('');
const errorMessage = ref('');
const deleteErrorOverlay = ref(null);

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
            val: 'Save',
            callback: buttonCallback
        };
    }
}

const save = () => {
    if(promiseRunning.value) return;

    promiseRunning.value = true;
    let res;

    try {
        res = skapi.updateService(service.value.service, {
            name: serviceName.value,
            cors: cors.value,
            api_key: apiKey.value
        });
    } catch(e) {
        throw e;
    } finally {
        promiseRunning.value = false;
    }
    return res;
}

const toggleService = async() => {
    if((togglePromise.value instanceof Promise) || promiseRunning.value) return;

    promiseRunning.value = true;
    try {
        if(service.value.active > 0) {
            togglePromise.value = skapi.disableService(service.value.service).then(() => {
                togglePromise.value = null;
            });
        } else {
            togglePromise.value = skapi.enableService(service.value.service).then(() => {
                togglePromise.value = null;
            });
        }
    } catch(e) {
        throw e;
    } finally {
        promiseRunning.value = false;
    }
}

const deleteServiceAsk = () => {
    if(promiseRunning.value) return;
    promiseRunning.value = true;
    deleteConfirmOverlay.value.open();
}

const deleteService = () => {
    if(confirmationCode.value !== service.value.service) {
        errorMessage.value = "Your service code did not match.";
        deleteConfirmOverlay.value.close();
        deleteErrorOverlay.value.open();
        promiseRunning.value = false;
        return;
    }

    skapi.deleteService(service.value.service).then(() => {
        deleteConfirmOverlay.value.close();
        router.replace('/dashboard');
    }).catch(() => {
        errorMessage.value = "Please disable your service before deleting it.";
        deleteConfirmOverlay.value.close();
        deleteErrorOverlay.value.open();
        promiseRunning.value = false;
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


.popup {
	background: #333333;
	border: 1px solid #808080;
	box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
	border-radius: 8px;
	padding: 60px 32px;
	margin: 12px;
	text-align: center;

	svg {
		height: 38px;
		width: 38px;
	}

	.title {
        color: #F04E4E;

		&>div {
			margin-top: 12px;
			font-size: 20px;
		}
	}

	.body {
		padding: 20px 0 28px 0;

        p {
            margin: 0 0 32px 0;

            &:last-of-type {
                margin-bottom: 24px;
            }
        }

        sui-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25), inset 1px 1px 1px rgba(0, 0, 0, 0.5);
            border-radius: 4px;
        }
	}

	.foot sui-button:first-child {
		margin-right: 12px;
	}
}
hr {
    opacity: 8%;
}
</style>