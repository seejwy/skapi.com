<template lang="pug">
.tab Information
.container
    template(v-if="user")
        .label(v-for="key in info")
            span {{ key.name || key.key }}
            .value {{ key.filter ? key.filter(user[key.key]) : user[key.key] || '-'}}
       
    template(v-else)
        div fetching
</template>
<script setup>
import { inject, ref, reactive, watch } from 'vue';
import { state, skapi } from '@/main';
import { useRoute } from 'vue-router';

import Icon from '@/components/Icon.vue';

let appStyle = inject('appStyle');
let pageTitle = inject('pageTitle');
const route = useRoute();

pageTitle.value = route.params.user_id;
let user = ref(null);
let serviceId = route.params.service;

const info = reactive([
    {
        key: 'user_id',
        name: 'User ID'
    },
    {
        key: 'name'
    },
    {
        key: 'suspended',
        name: 'Block/Unblocked',
        filter: (value) => {
            return value.includes('approved') ? 'unblocked' : 'blocked';
        }
    },
    {
        key: 'status'
    },
    {
        key: 'gender'
    },
    {
        key: 'address'
    },
    {
        key: 'email'
    },
]);

skapi.getUsers({
    service: serviceId,
    searchFor: 'user_id',
    condition: '=',
    value: route.params.user_id
}).then((res) => {
    user.value = res.list[0];
});

</script>
<style lang="less" scoped>
.tab {
    background-color: #333333;
    display: inline-block;
    margin: 12px 0 0 8px;
    border-radius: 8px 8px 0px 0px;
    padding: 0 12px;
    line-height: 40px;
}
.container {
    background-color: #333333;
    padding: 32px 12px;

    .label {
        color: #fff;
        margin-bottom: 32px;
        display: block;

        span {
            font-weight: bold;
            color: rgba(255, 255, 255, .4);
            text-transform: capitalize;
        }

        &:last-child {
            margin: 0;
        }
    } 
}
</style>