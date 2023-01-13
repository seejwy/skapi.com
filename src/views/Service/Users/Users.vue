<template lang="pug">
h1 This is user page
h2 Don't worry about pagination
h3 Lets do the desktop CSS first
h4 List of service users is in serviceUsers.list

template(v-if="serviceUsers")
    h5 These are your users:
    pre {{ serviceUsers.list }}

</template>
<!-- script below -->
<script setup>
import { inject, ref, watch, computed, nextTick } from 'vue';
import { skapi } from '@/main';
import { useRoute, useRouter } from 'vue-router';

let route = useRoute();
let router = useRouter();
let serviceId = route.params.service;

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

</style>