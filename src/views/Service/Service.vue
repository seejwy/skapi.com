<template lang="pug">
.container
    h2 How to start my service?
    p Well, this is how you start a service!!
    div.action
        sui-button.line-button Read Doc
.container
    h2 Service Information
    .information-grid
        .information-grid-item(v-for="info in informationGrid" :class="{'span-2': info.span}")
            .name {{ info.name }}
            .value(v-if="info.filter") {{ info.filter(service[info.key]) }}
            .value(v-else) {{ service[info.key] }}

.container
    h2 Service Setting 
    .setting-grid 
        .setting-grid-item(v-for="setting in settingGrid")
            .name {{ setting.name }}
            .value {{  service[setting.key] }}
        .setting-grid-item.actions
            sui-button.line-button Edit
.container
    h2 Manage your Service 
    .service-grid 
        .service-grid-item
            .title
                Icon users
                span Authentication
            div Users are data that your service user's will store and read from your service database. 
            RouterLink(:to="{name: 'users'}") Go to Users >
        .service-grid-item  
            .title
                Icon folder_open
                span Record
            div Users are data that your service user's will store and read from your service database. 
            RouterLink(:to="{name: 'records'}") Go to Records >
        .service-grid-item 
            .title
                Icon mail
                span Email System
            div Users are data that your service user's will store and read from your service database. 
            RouterLink(to="/") Go to Mail >

</template>
<script setup>
import { inject, reactive } from 'vue';
import { localeName, dateFormat } from '@/main';
import Icon from '../../components/Icon.vue';

let service = inject('service');
let pageTitle = inject('pageTitle');
pageTitle.value = 'Service "' + service.value.name + '"'

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
        key: null
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
        key: 'active'
    },
    {
        name: 'Name of Service',
        key: 'name'
    },
    {
        name: 'CORS',
        key: 'cors'
    },
    {
        name: 'API Key',
        key: 'api_key'
    },
]);
</script>
<style lang="less" scoped>
@import '../../assets/variables.less';

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
        margin-bottom: 40px;
    }

    .action {
        text-align: right;
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

        &.actions {
            align-self: flex-end;
        }
    }
}

.service-grid {
    display: flex;
    justify-content: space-between;
    gap: 100px;

    &-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 8px;

        .title {
            display: inline-block;
            color: rgba(255, 255, 255, 0.85);
            margin-bottom: 28px;

            span {        
                margin-left: 8px;    
                vertical-align: middle;
            }
        }

        a {
            text-align: left;
            margin-top: 40px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            text-decoration: none;
        }
    }
}
</style>