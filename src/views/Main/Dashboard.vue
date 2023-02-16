<template lang="pug">
div(v-if='!state?.connection')
    // is loading...
NewService(v-else-if="state?.user && route.query.new === 'service'")
div(v-else-if="state?.user")
    .header
        h1 Services
        div
            p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta sed metus eget auctor. Nulla quis nulla a lorem consequat gravida viverra ac nisi. Donec rutrum mauris orci. Sed a velit sed magna aliquet gravida rutrum et magna.
            sui-button(type="button" @click="state.viewport === 'desktop' ? isOpen = true : router.push('?new=service');")
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
    .container.empty(v-else)
        .title No Services
        span Get started by creating a new service. 
    Transition
        .toast(v-if="true")
            Icon warning_bell
            .title Email Verfication is Needed
            div
            .body Something to tell you
            Icon.close(@click="isOpen = false") X2
    sui-overlay(v-if="isOpen && state.viewport === 'desktop'" ref="newServiceWindow" style="background: rgba(0, 0, 0, 0.6)" @click="isOpen = false")
        div.overlay
            .close(@click="isOpen = false")
                Icon X2
            NewService
sui-overlay(v-else-if="state.viewport !== 'mobile'" ref="overlay" style="background: rgba(0, 0, 0, 0.6);")
    Login
Login(v-else)
</template>
<script setup>
import { inject, ref, watch, nextTick, onMounted } from 'vue';
import { state, skapi, dateFormat, awaitConnection } from '@/main';
import Login from './Login.vue';
import { useRoute, useRouter } from 'vue-router';

import NewService from '@/components/NewService.vue';
import Icon from '@/components/Icon.vue';

let router = useRouter();
let route = useRoute();

let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

let serviceList = ref(null);
let overlay;
const newServiceWindow = ref(null);
const isOpen = ref(false);

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

onMounted(() => {
    awaitConnection.then(()=>{
        if(!state.user) {
            overlay.open();
        }
    });
});
async function getServices(gs) {
    if (!(gs instanceof Promise) || !state.user) {
        return;
    }

    try {
        let services = await gs.then();

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
        } else {
            newServiceWindow.value.close();
        }
    }
});
watch(() => state.viewport, (viewport) => {
    if(viewport === 'desktop') router.replace('/dashboard');
})
</script>

<style lang="less" scoped>
@import '@/assets/variables.less';
.header {
    margin-top: 60px; 

    * {
        margin: 0;
    }

    h1 {
        font-size: 28px;
        margin-bottom: 20px;
    }

    & > div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        align-items: flex-end;
        column-gap: 30px;
        row-gap: 24px;
        margin-bottom: 36px;
        line-height: 1.5;
    }

    p {
        color: rgba(0, 0, 0, 0.85);
    }

    sui-button {    
        flex-shrink: 0;
    }
    
    sui-button svg {
        margin-right: 4px;
    }
}
.container {
    margin-top: 40px;

    &.empty {
        background: #F5F5F5;
        padding: 84px 0;
        border-radius: 8px;
        text-align: center;

        .title {
            font-size: 20px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.6);
            margin-bottom: 12px;
        }
    }

    .service {
        display: block;
        background: #595959;
        padding: 32px 40px;
        border-radius: 8px;
        color: unset;
        text-decoration: unset;
        
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

.toast {
    position: fixed;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    bottom: 40px;
    right: 40px;
    left: unset;
    column-gap: 16px;
    row-gap: 0px;
    border-radius: 8px;
    padding: 24px 68px 40px 24px;
    background: #FAFAFA;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);

    svg:not(.close) {
        height: 32px;
        width: 32px;
        color: #293FE6;    
    }
    
    .close {
        position: absolute;
        top: 11px;
        right: 11px;
        cursor: pointer;
    }

    .title {
        display: inline-block;
        font-weight: bold;
        color: #293FE6;
    }


    @media @tablet {
        column-gap: 12px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px 50px 28px 20px;
        color: rgba(0,0,0,.8);
        border-radius: 0;
        filter: drop-shadow(0px -2px 4px rgba(0, 0, 0, 0.25));
        
        svg:not(.close) {
            height: 32px;
            width: 32px;
        }
    }
}

@media @tablet {
    .header {
        margin-top: 24px; 
    }
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
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease, bottom 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
        bottom: -10px;
}
</style>
