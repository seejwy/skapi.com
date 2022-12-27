<template lang="pug">
h1 Please Login
sui-button(@click='login') Login
</template>
<script setup>
import { inject, watch } from 'vue';
import { skapi, state } from '@/main';
import { useRoute, useRouter } from 'vue-router';
let route = useRoute();
let router = useRouter();

// set page title
let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

watch(() => state.user, u => {
    // if logged in, and page is login page go to dashboard
    // when visited via url, can have page flash.
    if (u && route.name === 'login') {
        router.replace('/dashboard');
    }
});

function login() {
    skapi.login({
        email: 'jinyoon@broadwayinc.com',
        password: 'Bwq14321!!'
    }).then(u => {
        state.user = u;
    });
}

</script>