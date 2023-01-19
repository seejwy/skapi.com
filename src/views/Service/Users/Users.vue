<template lang="pug">
.page-header
    h1 Users
    p Users are data that your service user's will store and read from your service database. All records are organized by table names and restrictions. With additional query points such as index names and tags, references, you can have more flexible option when fetching the records.
    sui-button.line-button(style="float: right") Read Doc
    div(style="clear:both;")
.actions-wrapper
    .select-input(style='width: 400px;margin: 8px 0;' @click.stop)
        .select-field
            sui-select(name='search_type')
                option(value="id" selected) User ID
                option(value="email") Email
                option(value="name") Name

        .input-field
            span.material-symbols-outlined.placeholder-icon(v-if="!searchValue") search
            sui-input(type="search" autocomplete="off" :value="searchValue" @input="(e) => searchValue = e.target.value")
    
    .actions
        sui-button.text-button(@click="")
            Icon trash
            span block
        sui-button.text-button(@click="")
            Icon trash
            span unblock
        sui-button.text-button(@click="")
            Icon trash
            span delete
.table-header
    span(v-for="(value, key) in visibleFields") {{  key }}
    Icon refresh

template(v-if="serviceUsers")
    h5 These are your users:
    pre {{ serviceUsers.list }}

</template>
<script setup>
import { inject, ref, watch, computed, nextTick } from 'vue';
import { skapi } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from '@/components/Icon.vue';

let route = useRoute();
let router = useRouter();
let serviceId = route.params.service;
let searchValue = ref('');
let visibleFields = {
    'User ID': true,
    'Name': true,
    'Block': true,
    'Status': true,
    'Email': true,
    'Address': true,
    'Gender': true,
    'Birthdate': true
}

let pageTitle = inject('pageTitle');
pageTitle.value = 'Users';

// flag
let fetchingData = inject('fetchingData');

// data
let serviceUsers = inject('serviceUsers');
let searchResult = inject('searchResult');

let fetchLimit = 50;
function getUsers(refresh = false) {
    // initial table fetch

    if (!refresh && serviceUsers.value) {
        // bypass if already fetched
        fetchingData.value = false;
        return;
    }

    serviceUsers.value = null;
    fetchingData.value = true;

    let params = {
        service: serviceId,
        searchFor: 'timestamp',
        condition: '>',
        value: 0
    };

    skapi.getUsers(params, { refresh: true, limit: fetchLimit })
        .then(t => {
            serviceUsers.value = {
                endOfList: t.endOfList,
                list: t.list,
                params
            };

            fetchingData.value = false;
        }).catch(err => {
            fetchingData.value = false;
            throw err;
        });

    return;
}

// get users on created
getUsers();
</script>
<style lang="less" scoped>
@import '@/assets/variables.less';
.page-header {
    padding: 50px 0;

    @media @tablet {
        padding: 24px 0;
    }
}
.actions-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .actions {
        & > * { 
            display: inline-block;
            margin-left: 16px;
        }

        svg {
            width: 20px;
            height: 20px;
            margin-right: 4px;
        }

    }
}

.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 36px;
    padding: 0 18px;
    background: #434343;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25), inset 1px 1px 1px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.4);
    height: 58px;

    svg {
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
    }
}
</style>