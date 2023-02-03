<template lang="pug">
Login(v-if="!state.connection || !state.user")
div(v-if='!state.connection')
    // is loading...

//- div(v-else-if='state.user')
div
    h1 The Dashboard
    template(v-if="serviceList")
        template(v-for="(srvc, reg) in serviceList")
            p {{ reg }}
            ul
                li(v-for='s in srvc')
                    router-link(:to='"/dashboard/" + s.service') {{ s.service }}
</template>
<!-- script below -->
<script setup>
import { inject, ref, watch } from 'vue';
import { state } from '@/main';
import Login from './Login.vue';
import { useRouter } from 'vue-router';
let router = useRouter();

let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

let serviceList = ref(null);

async function getServices(gs) {
    if (!(gs instanceof Promise) || !state.user) {
        return;
    }

    try {
        let services = await gs.then();
        if (serviceList.value === null) {
            serviceList.value = services;
        }
        else {
            for (let region in services) {
                serviceList.value[region] = services[region];
            }
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
</script>