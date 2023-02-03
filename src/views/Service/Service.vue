<template lang="pug">
.container
    h2 How to start my service?
    p Well, this is how you start a service!!
    div.action
        sui-button.line-button Read Doc
.container
    .title-wrapper
        Icon warning
        h2 Service Information
    .information-grid
        .information-grid-item(v-for="info in informationGrid" :class="[info.span ? `span-${info?.span}` : '']")
            .name {{ info.name }}
            .value(v-if="info.filter") {{ info.filter(service[info.key]) }}
            .value(v-else) {{ service[info.key] }}

.container
    .title-actions-wrapper
        .title-wrapper
            Icon setting
            h2 Service Setting 
        .actions
            sui-button.line-button Edit
    .setting-grid 
        .setting-grid-item(v-for="setting in settingGrid")
            .name {{ setting.name }}
            .value {{  service[setting.key] || '-' }}
.container
    h2 Manage your Service 
    .service-grid 
        .service-grid-item
            .content
                .title
                    Icon users
                    span Authentication
                .body Users are data that your service user's will store and read from your service database. 
            RouterLink(:to="{name: 'users'}") Go to Users >
        .service-grid-item  
            .content
                .title
                    Icon folder_open
                    span Record
                .body Users are data that your service user's will store and read from your service database. Users are data that your service user's will store and read from your service database. 
            RouterLink(:to="{name: 'records'}") Go to Records >
        .service-grid-item 
            .content
                .title
                    Icon mail
                    span Email System
                .body Users are data that your service user's will store and read from your service database. 
            RouterLink(to="/") Go to Mail >
</template>
<script setup>
import { inject, reactive } from 'vue';
import { regionName, dateFormat } from '@/main';
import Icon from '../../components/Icon.vue';

let service = inject('service');
let pageTitle = inject('pageTitle');
pageTitle.value = 'Service "' + service.value.name + '"'

const informationGrid = reactive([
    {
        name: 'Service ID',
        key: 'service',
        span: 2
    },
    {
        name: 'User ID',
        key: 'owner',
        span: 2
    },
    {
        name: 'Group',
        key: 'group',
        filter: (value) => {
            return value === 1 ? "Basic" : "Premium";
        }
    },
    {
        name: 'Service Location',
        key: 'region',
        filter: (value) => {
            return regionName(value);
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

])

const settingGrid = reactive([
    {
        name: 'Enable/Disable',
        key: 'active',
    },
    {
        name: 'Name of Service',
        key: 'name',
    },
    {
        name: 'CORS',
        key: 'cors'
    },
    {
        name: 'API Key',
        key: 'api_key'
    },
])
</script>
<style lang="less" scoped>
@import '@/assets/variables.less';

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
        display: inline-block;
        vertical-align: middle;
        font-size: 20px;
        margin-bottom: 32px;
    }

    .title-actions-wrapper {
        display: flex;
        justify-content: space-between;
    }

    .title-wrapper {
        margin-bottom: 32px;

        h2 {
            margin: 0;
        }

        svg {
            margin-right: 8px;
        }
    }

    

    .action {
        text-align: right;
    }

    @media @tablet {    
        margin: 16px -16px;
        padding: 40px 20px;
        border-radius: 0;

        &:first-child {
            margin-top: 0;
        }
    }

    @media @phone {    
        margin: 16px -8px;
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
            margin-bottom: 8px;
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
    gap: 20px;

    &-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
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
            }
        }

        a {
            text-align: left;
            margin-top: 40px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            text-decoration: none;
        }
    }

    @media screen and (max-width: 850px) {
        flex-direction: column;
    }
}
</style>