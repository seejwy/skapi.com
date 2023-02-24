<template lang="pug">
EditService(v-if="state?.user && route.query.edit === 'service'" @close="router.replace({query: null})")
template(v-else)
    .page-header.head-space-helper
        h2 How to start my service?
        p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dignissim purus et arcu placerat dignissim. Aliquam ipsum libero, bibendum et pharetra at, rutrum ac enim. Donec vel dictum orci. Cras turpis massa, dapibus eget tincidunt sollicitudin, sollicitudin sed ipsum. Suspendisse et imperdiet ipsum. Nullam quis velit sit amet urna iaculis mollis in vitae tortor. Sed interdum feugiat diam, vel facilisis velit sagittis vel. Donec dolor augue, mattis a ipsum quis, venenatis mollis ante.
        div.action
            sui-button.line-button Read Doc
    .container
        .title-actions-wrapper.showOnTablet
            .title-wrapper
                Icon information
                h2 Service Information
        .inner-container 
            .title-actions-wrapper.hideOnTablet
                .title-wrapper
                    Icon information
                    h2 Service Information
            .information-grid
                .information-grid-item(v-for="info in informationGrid" :class="[info.span ? `span-${info?.span}` : '']")
                    .name {{ info.name }}
                    .value(v-if="info.filter") {{ info.filter(service[info.key]) }}
                    .value(v-else) {{ service[info.key] }}

    .container
        .title-actions-wrapper.showOnTablet
            .title-wrapper
                Icon setting
                h2 Service Setting 
            .actions(@click="edit")
                Icon pencil
        .inner-container 
            .title-actions-wrapper.hideOnTablet
                .title-wrapper
                    Icon setting
                    h2 Service Setting 
                .actions(@click="edit")
                    Icon pencil
                    span Edit
            .setting-grid 
                .setting-grid-item(v-for="setting in settingGrid")
                    .name 
                        span {{ setting.name }}
                        sui-tooltip(v-if="setting.tip")
                            Icon(slot="tool") question
                            div(slot="tip") {{ setting.tip }}
                    .value(v-if="setting.key === 'active'")
                        .indicator(:class="{'active': service[setting.key] > 0}")
                        span(v-if="service[setting.key] > 0") Enabled 
                        span(v-else) Disabled
                    .value(v-else) {{  service[setting.key] || '-' }}
    .container
        .title-actions-wrapper.showOnTablet
            .title-wrapper
                h2 Manage your Service 
        .inner-container.services
            .title-actions-wrapper.hideOnTablet
                .title-wrapper
                    h2 Manage your Service 
            .service-grid 
                RouterLink(:to="{name: 'users'}").service-grid-item
                    .content
                        .title
                            Icon users
                            span Authentication
                        .body Users are data that your service user's will store and read from your service database. 
                    .goto Go to Users >
                RouterLink(:to="{name: 'records'}").service-grid-item  
                    .content
                        .title
                            Icon folder_open
                            span Record
                        .body Users are data that your service user's will store and read from your service database. Users are data that your service user's will store and read from your service database. 
                    .goto Go to Records >
                RouterLink(to="/").service-grid-item 
                    .content
                        .title
                            Icon mail
                            span Email System
                        .body Users are data that your service user's will store and read from your service database. 
                    .goto Go to Mail >
    sui-overlay(v-if="isEdit && state.viewport === 'desktop'" ref="settingWindow" style="background: rgba(0, 0, 0, 0.6)" @click="isEdit = false")
        div.overlay
            .close(@click="isEdit = false")
                Icon X2
            EditService(@close="isEdit = false")
</template>
<script setup>
import { inject, reactive, ref, watch, nextTick } from 'vue';
import { state, regions, localeName, dateFormat } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import EditService from '@/components/EditService.vue';
import Icon from '../../components/Icon.vue';

const route = useRoute();
const router = useRouter();

let service = inject('service');
let pageTitle = inject('pageTitle');
pageTitle.value = 'Service "' + service.value.name + '"'

const settingWindow = ref(null);
const isEdit = ref(false);

const informationGrid = reactive([
    {
        name: 'User ID',
        key: 'owner',
        span: 2
    },
    {
        name: 'Service ID',
        key: 'service',
        span: 2
    },
    {
        name: 'Group',
        key: 'group',
        filter: (value) => {
            return value == 1 ? 'Basic' : 'Premium'
        }
    },
    {
        name: 'Service Location',
        key: 'region',
        filter: (value) => {
            return localeName(value);
        }
    },
    {
        name: 'Date Created',
        key: 'timestamp',
        filter: (value) => {
            return dateFormat(value).split(' ')[0];
        }
    },
    {
        name: 'Storage Use',
        key: 'storage',
        filter: (value) => {
            let val = value || 0;
            return `${val}KB`
        }
    },
    {
        name: '# of Users',
        key: 'users'
    },
    {
        name: '# of Newsletter Sub',
        key: 'newsletter_subscribers'
    },
]);

const settingGrid = reactive([
    {
        name: 'Enable/Disable',
        key: 'active',
        filter: () => {
            return 1
            // return .indicator(:class="{'active': service.active > 0}")
        }
    },
    {
        name: 'Name of Service',
        key: 'name',
    },
    {
        name: 'CORS',
        key: 'cors',
        tip: 'Cors tip goes here',
    },
    {
        name: 'API Key',
        key: 'api_key',
        tip: 'Cors tip goes here',
    },
]);

const edit = () => {
    if(state.viewport === 'desktop') isEdit.value = true;
    else router.push('?edit=service');
}

const opensettingWindow = () => {
    if(state.viewport === 'mobile') router.push('?new=service');
    else settingWindow.value.open();
}

watch(() => isEdit.value, async () => {
    if(state.viewport === 'desktop') {
        await nextTick();
        if(isEdit.value) {
            opensettingWindow();
        }
    }
});
</script>
<style lang="less" scoped>
@import '@/assets/variables.less';
.container {
    margin: 0 0 40px 0;

    .inner-container {    
        padding: 40px;
        background: #434343;
        border-radius: 12px;
        .title-actions-wrapper {
            margin-bottom: 32px;

            h2 {
                font-size: 20px;
                font-weight: normal;
            }
        }
    }

    h2,
    p {
        color: rgba(255, 255, 255, .85);
        margin: 0;
    }

    h2 {
        display: inline-block;
        vertical-align: middle;
        font-size: 24px;
        margin-bottom: 50px;
        font-weight: bold;

        @media @tablet {        
            margin-bottom: 28px;
        }
    }

    p {
        color: rgba(255, 255, 255, .85);
        line-height: 1.5;
    }

    .title-actions-wrapper {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        h2 {        
            font-size: 20px;
            font-weight: normal;
        }
    }

    .title-wrapper {
        h2 {
            margin: 0;
        }

        svg {
            margin-right: 8px;
        }
    }

    .actions {
        cursor: pointer;
        svg {
            margin-right: 4px;
        }
        span {
            vertical-align: middle;
        }
    }

    @media @tablet {    
        margin: 40px 0 0;
        border-radius: 0;

        &:first-child {
            margin-top: 0;
        }

        .inner-container {    
            padding: 20px;

            &.services {
                padding: 0;
                background-color: transparent;
            }
        }
    }

    &:last-child {
        margin-bottom: 0;
    }
}

.information-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 160px);
    column-gap: 16px;
    row-gap: 40px;

    &-item {
        .name {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 8px;
        }

        .value {
            font-weight: bold;
            color: rgba(255, 255, 255, 0.85);
        }

        &.span-2 {
            grid-column: span 2;
        }

        @media @phone {
            &.span-2 {
                grid-column: span 1;
            }
        }
    }
}

.setting-grid {
    display: flex;
    justify-content: space-between;
    
    &-item {
        .name {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 8px;
        }

        .value {
            font-weight: bold;
            color: rgba(255, 255, 255, 0.85);
        }

        &.span-2 {
            grid-column: span 2;
        }
    }

    @media screen and (max-width: 980px) {    
        grid-template-columns: repeat(4, 1fr);
    }

    @media screen and (max-width: 730px) {    
        grid-template-columns: repeat(2, 1fr);
    }

    @media @phone {
        grid-template-columns: repeat(1, 1fr);
        &-item {
            &.span-2 {
                grid-column: span 1;
            }
        }
    }
}

.setting-grid {
    display: grid;
    column-gap: 12px;
    row-gap:36px;
    grid-template-columns: repeat(4, calc(25% - 30px)) 72px;

    &-item {
        .name {
            font-size: 14px;
            line-height: 1;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 8px;
        }

        .value {
            font-weight: bold;
            color: rgba(255, 255, 255, 0.85);
            word-break: break-all;

            span {    
                vertical-align: middle;
            }
        }

        &.actions {
            align-self: flex-end;
            justify-self: flex-end;
        }
    }

    @media screen and (max-width: 1000px) {
        grid-template-columns: repeat(2, calc(50% - 6px));
        &-item {
            &.actions {
                grid-column: span 2;
                align-self: flex-end;
                justify-self: flex-end;
            }
        }
    }

    @media @phone {
        display: flex;
        flex-direction: column;

        &-item {
            &.actions {         
                grid-column: span 2;
                justify-self: flex-end;
            }
        }
    }

    
}

.service-grid {
    display: flex;
    justify-content: space-between;
    gap: 20px;

    @media screen and (max-width: 825px) {
        flex-direction: column;
    }

    &-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        padding: 24px;
        border-radius: 8px;
        .content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            .title {
                display: inline-block;
                margin-bottom: 28px;
                font-size: 20px;

                span {        
                    margin-left: 8px;    
                    vertical-align: middle;
                }
            }

            .body {    
                color: rgba(255, 255, 255, 0.85);
                line-height: 1.5;
            }
        }

        .goto {
            text-align: left;
            margin-top: 40px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            text-decoration: none;
        }
    }
    a.service-grid-item {
        text-align: left;
        color: rgba(255, 255, 255, 0.85);
        font-size: 14px;
        text-decoration: none;
    }

    @media screen and (max-width: 940px) {
        flex-direction: column;
        gap: 20px;

        &-item { 
            border-radius: 12px;
        }
    }

    @media @tablet {
        &-item {
            padding: 24px;
            background: #434343;
        }
    }
}
sui-tooltip {
    margin-top: -7px;
    margin-left: 8px;
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
    margin-right: 8px;
    
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

        a {
            text-align: left;
            margin-top: 40px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            text-decoration: none;
        }
    }
}
</style>