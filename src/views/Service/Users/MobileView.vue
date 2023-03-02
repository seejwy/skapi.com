<template lang="pug">
.head
    .tab Information
.container
    template(v-if="user")
        .label(v-for="key in info")
            span {{ key.name || key.key }}
            .value(:class="key.class") 
                Icon(v-if="key.icon") {{ key.icon(user[key.key]) }}
                span {{ key.filter ? key.filter(user[key.key]) : user[key.key] || '-'}}
       
    template(v-else)
        div fetching
</template>
<script setup>
import { inject, ref, reactive, watch, onBeforeUnmount } from 'vue';
import { state, skapi } from '@/main';
import { useRouter, useRoute } from 'vue-router';

import Icon from '@/components/Icon.vue';

let appStyle = inject('appStyle');
let pageTitle = inject('pageTitle');
const router = useRouter();
const route = useRoute();
const navbarBackDestination = inject('navbarBackDestination');
navbarBackDestination.value = 'back';
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
        icon: (value) => {
            return value.includes('approved') ? 'unblock' : 'block';
        },
        filter: (value) => {
            return value.includes('approved') ? 'Unblocked' : 'Blocked';
        }
    },
    {
        key: 'group',
        name: 'Status',
        icon: (value) => {
            return value > 0 ? 'check_circle' : 'X';
        },
        filter: (value) => {
            return value > 0 ? 'Enabled' : 'Disabled';
        }
    },
    {
        key: 'gender',
        class: 'capitalize'
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

watch(() => state.viewport, (viewport) => {
    if(viewport === 'desktop') {
        router.replace({name: 'users'});
    }
}, {immediate: true});

appStyle.background = '#333333';
onBeforeUnmount(() => {
    appStyle.background = null;
})
</script>
<style lang="less" scoped>
@import '@/assets/variables.less';
.head {
    background-color: #595959;
    margin: 0 -20px;
    .tab {
        background-color: #333333;
        display: inline-block;
        margin: 12px 0 0 8px;
        border-radius: 8px 8px 0px 0px;
        padding: 0 12px;
        line-height: 40px;
    }

    @media @phone {
        margin: 0 -16px;
    }
}
.container {
    background-color: #333333;
    padding: 32px 12px;

    .label {
        color: #fff;
        margin-bottom: 32px;
        display: block;

        & > span {
            font-weight: bold;
            color: rgba(255, 255, 255, .4);
            text-transform: capitalize;
        }

        &:last-child {
            margin: 0;
        }

        .capitalize {
            text-transform: capitalize;
        }

        .value {
            margin-top: 8px;
            svg {
                margin-right: 10px;
            }
            span {
                vertical-align: middle;
            }
        }
    }

    @media @tablet {
        margin: 0 -20px;
    }
    
    @media @phone {
        margin: 0 -16px;
    }
}
</style>