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
            .value {{ service[info.key] }}
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
        key: null
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
}

.information-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &-item {
        .name {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
        }

        .value {
            color: rgba(255, 255, 255, 0.85);
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