<template lang="pug">
div(v-if='!state?.connection')
    // is loading...
NewService(v-else-if="state?.user && route.query.new === 'service'")
div(v-else-if="state?.user")
    .page-header.head-space-helper
        h1.fixed Services
        p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta sed metus eget auctor. Nulla quis nulla a lorem consequat gravida viverra ac nisi. Donec rutrum mauris orci. Sed a velit sed magna aliquet gravida rutrum et magna.
        .action
            sui-button.with-icon(type="button" @click="state.user.email_verified ? state.viewport === 'desktop' ? isOpen = true : router.push('?new=service') : null" :disabled="!state.user.email_verified || null")
                Icon plus2
                span New Service
    .container(v-if="serviceList?.length")
        template(v-for="service in serviceList")
            router-link.service(:to='"/dashboard/" + service.service')
                .settings
                    .name 
                        .indicator(:class="{'active': service.active > 0}")
                        span {{ service.name }}
                    Icon right
                .details
                    .item(v-for="(value, key) in filterServiceDetails(service)" :class="{'hide-mobile': key.toLowerCase() !== 'cors'}")
                        .title {{  key }}
                        .value {{ value || '-' }}
    .container.empty(v-else-if="isFetchingServices")
        Icon.animation-rotation(style="position: absolute; right: 24px; top: 24px; fill: var(--primary-color)") refresh
    .container.empty.no-service(v-else)
        div(style="position: absolute; width: 100%;")
            .title No Services
            span Get started by creating a new service. 
    Transition(name="toast")
        .toast(v-if="state.user && !state.user.email_verified && state.showVerificationNotification")
            Icon warning_bell
            .title Email Verfication is Needed
            div
            .body Please verify your email to prevent your services from shutting down.
            Icon.close(@click="state.setVerificationDelay") X2
    sui-overlay(v-if="isOpen && state.viewport === 'desktop'" ref="newServiceWindow" style="background: rgba(0, 0, 0, 0.6)" @mousedown="isOpen = false")
        div.overlay
            NewService(@close="isOpen = false")
</template>
<script setup>
import { inject, ref, watch, nextTick, computed } from 'vue';
import { state, skapi, dateFormat, awaitConnection } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import NewService from '@/components/NewService.vue';
import Icon from '@/components/Icon.vue';

let router = useRouter();
let route = useRoute();

let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

let serviceList = ref(null);
let overlay = ref(null);
const newServiceWindow = ref(null);
const isOpen = ref(false);
const isFetchingServices = ref(true);

const filterServiceDetails = (service) => {
    return {
        'Locale': service.region,
        'CORS': service.cors,
        'Date Created': dateFormat(service.timestamp).split(' ')[0]
    }
}

const openNewServiceWindow = () => {
    if(state.viewport === 'mobile') router.push('?new=service');
    else newServiceWindow.value.open();
}

async function getServices(gs) {
    if (!(gs instanceof Promise) || !state.user) {
        return;
    }

    try {
        let services = await gs;
        isFetchingServices.value = false;
        if(serviceList.value === null) {
            serviceList.value = [];
            for(let region in services) {
                serviceList.value = [...serviceList.value, ...services[region]];
            }

            serviceList.value.sort((a, b) => a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0);
        }

        return services;

    } catch (err) {
        serviceList.value = null;
        throw err;
    }
}

getServices(state.getServices);

// watch is for users visiting the page directly
watch(() => state.getServices, getServices);
watch(() => isOpen.value, async () => {
    if(state.viewport === 'desktop') {
        await nextTick();
        if(isOpen.value) {
            openNewServiceWindow();
        }
    }
});
watch(() => state.viewport, (viewport) => {
    if(viewport === 'desktop') {
        isOpen.value = false;
        router.replace('/dashboard');
    }
})
</script>

<style lang="less" scoped>
@import '@/assets/variables.less';

.container {
    &.empty {
        position: relative;
        display: inline-flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        background: #F5F5F5;
        height: 175.33px;
        border-radius: 8px;
        text-align: center;
        
        @media screen and (max-width: 825px) {
            height: 156px;
        }

        @media @phone {
            height: 123.33px;
        }



        .title {
            font-size: 28px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.6);
            margin-bottom: 12px;
        }

        &.no-service {
            min-height: 220px;
        }
    }

    .service {
        display: block;
        background: #595959;
        padding: 32px 40px;
        border-radius: 8px;
        color: unset;
        text-decoration: unset;

        &:hover {
            background: #8C8C8C;
        }

        @media @tablet {
            &:hover {
                background: #595959;
            }
        }
        
        &:not(:last-child) {
            margin-bottom: 24px;
        }

        .settings {
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
        }

        .name span {
            margin-left: 12px;
            color: #fff;
            font-size: 24px;
            vertical-align: middle;
        }

        .details {
            display: flex;
            justify-content: flex-start;
            column-gap: 33px;
            flex-wrap: wrap;
            overflow: hidden;

            .item {
                width: 200px;
            }

            @media screen and (max-width: 825px) {

                .item {
                    display: flex;
                    width: 100%;
                }
                
                .hide-mobile {
                    display: none;
                }
            }

            .title {
                color: rgba(255, 255, 255, .4);
                margin-bottom: 12px;
            }

            .value {
                font-weight: bold;
                color: rgba(255, 255, 255, .85);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
.indicator {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #D9D9D9;
    border: 0.3px solid #595959;
    box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.25), inset 1px 1px 2px rgba(255, 255, 255, 0.65);
    
    &.active {
        background: #5AD858;
    }
}

.overlay {
    padding: 16px;
    .close {
        position: absolute;
        top: 0;
        right: 0;
        width: 32px;
        height: 32px;
        background-color: #BFBFBF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        svg {
            color: #434343;
        }
    }
}

@media @tablet {
    .container {
        .service {
            padding: 24px;
            .name span{
                font-size: 20px;
            }   
            .details .item {
                .title,
                .value {
                    display: inline-block;
                    margin: 0 12px 0 0;
                    vertical-align: middle;
                }
            }
        }
    }
}
</style>
