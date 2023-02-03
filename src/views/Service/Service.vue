<template lang="pug">
.container
    h2 How to start my service?
    p Well, this is how you start a service!!
    div.action
        sui-button.line-button Read Doc
.container
    h2 Service Information
    .information-grid
        .information-grid-item(v-for="info in informationGrid")
            .name {{ info.name }}
            .value(v-if="info.filter") {{ info.filter(service[info.key]) }}
            .value(v-else) {{ service[info.key] }}

.container
    h2 Service Setting 
    .setting-grid 
        .setting-grid-item(v-for="setting in settingGrid")
            .name {{ setting.name }}
            .value {{  service[setting.key] || '-' }}
        .setting-grid-item.actions
            sui-button.line-button Edit
.container
    h2 Manage your Service 
    .service-grid 
        .service-grid-item
            div
                Icon user_setting
                span.title Authentication
            div something else
        .service-grid-item  
            div
                Icon service
                span.title Record
        .service-grid-item 
            div
                Icon mail
                span.title Email System

.container
    h2 Security 
    p Well, this is how you start a service!!
    div.action
        sui-button.line-button Edit

h1 Service Dashboard
h4 {{ service.name }}
hr
ul
    li
        router-link(:to="{name:'records'}") Records
    li
        router-link(:to="{name:'users'}") Users

</template>
<script setup>
import { inject, reactive } from 'vue';
import Icon from '../../components/Icon.vue';

let service = inject('service');
let pageTitle = inject('pageTitle');
pageTitle.value = 'Service "' + service.value.name + '"'

const informationGrid = reactive([
    {
        name: 'Name of Service',
        key: 'name'
    },
    {
        name: 'Date Created',
        key: 'timestamp'
    },
    {
        name: 'Service ID',
        key: 'service'
    },
    {
        name: 'Service Location',
        key: 'region'
    },
    {
        name: 'CORS',
        key: 'cors'
    },
    {
        name: 'API Key',
        key: 'api_key'
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
        name: 'User ID',
        key: 'owner'
    },
    {
        name: '# of Users',
        key: 'users'
    },
    {
        name: '# of Newsletter Sub',
        key: 'newsletter_subscribers'
    },
    {
        name: 'Group',
        key: 'group'
    },

])
</script>
<style lang="less" scoped>
.container {
    padding: 40px;
    background: #434343;
    border-radius: 12px;
    margin: 40px 0;

    h2,
    p {
        margin: 0;
    }

    h2 {
        font-size: 20px;
        margin-bottom: 32px;
    }

    .action {
        text-align: right;
    }

    @media @tablet {    
        margin: 16px 0;
        padding: 40px 20px;
        border-radius: 0;
    }
}

.information-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 16px;
    row-gap: 36px;

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
            color: rgba(255, 255, 255, 0.6);
        }

        .value {
            color: rgba(255, 255, 255, 0.85);
            word-break: break-all;
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
    gap: 100px;

    &-item {
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 8px;

        .title {
            display: inline-block;
            margin-left: 8px;
            vertical-align: middle;
            color: rgba(255, 255, 255, 0.85);
        }
    }
}
</style>