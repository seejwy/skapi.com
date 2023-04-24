<template lang="pug">
.overlay-container
    form.dashboard(@submit.prevent="createNewService" action="")
        .overlay-container-title.hideOnTablet Create a New Service
        .overlay-container-text Your service will have its own dedicated instance and full postgres database. An API will be set up so you can easily interact with your new database.
        sui-input(type="text" :disabled="isDisabled" placeholder="Name of Service" :value="serviceName" @input="(e) => serviceName = e.target.value" required)
        sui-button.line-button(v-if="state.viewport === 'desktop'" :disabled="isDisabled" type="button" @click="emit('close', '')" style="margin-right: 16px;") Cancel
        SubmitButton(:loading="isDisabled" :disabled="isDisabled") Create
</template>
<!-- script below -->
<script setup>
import { inject, reactive, ref, watch, onBeforeUnmount } from 'vue';
import { state, skapi, countries, regions } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from './Icon.vue';
import SubmitButton from './SubmitButton.vue';

let route = useRoute();
let router = useRouter();
const emit = defineEmits(['close']);
const isCreatingService = ref(false);
let appStyle = inject('appStyle');
let pageTitle = inject('pageTitle');
let navbarMobileRightButton = inject('navbarMobileRightButton');
const serviceName = ref('');
const isDisabled = ref(false);

if(state.viewport === 'mobile') {
    pageTitle.value = 'Create a new Service'
    appStyle.navBackground = '#505050';
    appStyle.background = '#333333';
    navbarMobileRightButton.value = {
        type: 'hidden'
    };
}

onBeforeUnmount(() => {
    appStyle.background = null;
    appStyle.navBackground = '#293fe6';
    pageTitle.value = 'skapi';
    navbarMobileRightButton.value = null;
});

const states = {
    US: {
        OH: {
            lat: 40.367474, 
            long: -82.996216
        },
        VA: {
            lat: 37.926868,
            long: -78.024902
        }
    }
}

const getClosestRegion = () => {
    let currentLocale = skapi.connection.locale;
    let res = '';

    if(regions[skapi.connection.locale]) {
        res = skapi.connection.locale;
    } else {
        let difference = null;
        for (let region in regions) {
            let distance = calculateDistance(countries[currentLocale], countries[region]);
            if(difference == null || distance < difference) {
                difference = distance;
                res = region;
            }
        }
    }
    
    if(res === 'US') {
        let country = res;
        let difference = null;
        for (let state in states[country]) {
            let distance = calculateDistance(states[country][state], countries[currentLocale]);
            if(difference == null || distance < difference) {
                difference = distance;
                res = state;
            }
        }

        return regions[country][res];
    }

    return regions[res];
}
const calculateDistance = (locale, region) => {
    const R = 6371e3; // metres
    const φ1 = (locale.lat * Math.PI) / 180; // φ, λ in radians
    const φ2 = (region.lat * Math.PI) / 180;
    const Δφ = ((region.lat - locale.lat) * Math.PI) / 180;
    const Δλ = ((region.long - locale.long) * Math.PI) / 180;

    const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    return d;
}

const createNewService = async() => {
    isDisabled.value = true;
    const serviceLocale = getClosestRegion();
    state.blockingPromise = skapi.createService({region: serviceLocale, name: serviceName.value});
    let res = await state.blockingPromise;
    isDisabled.value = false;
    router.push(`/dashboard/${res.service}`);
}

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

    &-text {
        color: rgba(255, 255, 255, 0.85);
        margin: 0 0 28px 0;
        line-height: 1.5;
    }

    sui-input {
        display: block;
        margin-bottom: 40px;
        width: 100%;

        &[type=submit] {
            display: inline-block;        
            width: unset;
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

        &-text {
            text-align: left;
        }
    }
}
</style>